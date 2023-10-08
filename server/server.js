import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import mysql from 'mysql';
import fileUpload from 'express-fileupload';
import AWS from 'aws-sdk';
import { S3Client, DeleteBucketCommand } from '@aws-sdk/client-s3';

const PORT = 5000;
const salt = 10;

const app = express();

const db = mysql.createConnection({
    host: "db-mysql-project1.cahpyfzveijy.us-west-1.rds.amazonaws.com",
    user: "admin",
    password: "gPQicnjQqRNy",
    database: "rdscloudproject1"
})


app.use(express.json());
app.use(fileUpload());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true
}));

app.use(cookieParser());



// app.post('/upload', async (req, res) => {
//     const fileContent = Buffer.from(req.file.data.image, 'binary');
//     console.log(fileContent)
//     console.log(req.data)
// });
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are not Authenticated" })
    } else {
        jwt.verify(token, "jwt-secret-token", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token is Not Ok" });
            } else {
                req.name = decoded.name;
                req.id = decoded.id;
                next()
            }
        })
    }
}

app.get('/', verifyUser, (req, res) => {
    return res.json({ Status: "Success", name: req.name , id: req.id})
})


app.post('/register', (req, res) => {
    const sql = "INSERT INTO users (`user_name`, `first_name`, `last_name`, `password`) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) return res.json({ Error: "Error for hassing password" });
        console.log("================================")
        console.log(req.body.password.toString())
        console.log(hash)
        console.log("================================")
        const values = [
            req.body.username,
            req.body.firstName,
            req.body.lastName,
            hash
        ]
        // console.log(req.body.lastName)

        db.query(sql, [values], (err, result) => {
            if (err) return res.json({ Error: err });
            return res.json({ Status: "Success" });
        });

        // const res = await pool.query(sql, values)

    });
    // console.log(req.body.username);
})

app.post('/login', (req, res) => {

    const sql = "SELECT * FROM users WHERE user_name = ?";
    db.query(sql, [req.body.username], (err, data) => {
        if (err) return res.json({ Error: "Login Error in Server" })
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, function (err, response) {
                if (err) return res.json({ Error: "Password Compare Error" });
                if (response) {
                    console.log(data[0].user_name)
                    const id = data[0].id;
                    const name = data[0].user_name;
                    const token = jwt.sign({ name, id }, "jwt-secret-token", { expiresIn: '1d' });
                    res.cookie('token', token)
                    return res.json({ Status: "Success" });
                } else {
                    return res.json({ Error: "Password not matched" });
                }
            })
        } else {
            return res.json({ Error: "Username does not exist" })
        }
    })
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"});
})


// ===============================================
app.post('/delete', async (req, res) =>  {
    AWS.config.update({
        accessKeyId: "AKIAT7DMIEQ4SJ2R34NQ",
        secretAccessKey: "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",
        region: "us-east-2"
    })

    console.log(req.body.keyFile)
    // res.json({data: req.body})
    const sql = "DELETE FROM rdscloudproject1.user_file_logs WHERE key_file = ?"
    
    // 
    
    const s3 = new AWS.S3();

    const params = {
        Bucket: 'hw2-web-cloud-storage',
        Key: req.body.keyFile
    }

    s3.deleteObject(params, (err, data) => {
        if (err) {
            throw err;
        };

        db.query(sql, [req.body.keyFile], (err, data) => {
            if (err) return res.json({Error: `Failed to Delete:${req.body.keyFile} entry From database`})
        })

        res.send({
            "response_code": 200,
            "Status": "Success",
            "response_data": data
        })

    })

    // const command = new DeleteBucketCommand(input);
    // const response = await client.send(command);


    
})

app.post('/upload', async (req, res) => {
    AWS.config.update({
        accessKeyId: "AKIAT7DMIEQ4SJ2R34NQ",
        secretAccessKey: "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",
        region: "us-east-2"
    })

    const sql = "INSERT INTO rdscloudproject1.user_file_logs (`user_id`, `key_file`, `created_at`, `updated_at`, `desc`) VALUES (?)";

    const values = [
        req.body.userID,
        req.files.file.name,
        req.body.currentDateTime, //Created
        req.body.currentDateTime, //Updated
        req.body.desc
    ]
    console.log(req.files.file.name)
    console.log(values)
    console.log(req.body)
    // return res.json(req.body)


    const s3 = new AWS.S3({
        useAccelerateEndpoint: true
    });

    const fileContent = Buffer.from(req.files.file.data, 'binary');
    const params = {
        Bucket: 'hw2-web-cloud-storage',
        Key: req.files.file.name,
        Body: fileContent
    }
    

    s3.upload(params, (err, data) => {
        if (err) {
            throw err;
        };

        db.query(sql, [values], (err, result) => {
            if (err) return res.json({ Error: "Filed to Insert Data Entry into Database" })
        })

        res.send({
            "response_code": 200,
            "response_message": "Success",
            "response_data": data
        })

        // console.log(data)
        // if (data) {

        // }
    })

})


app.listen(PORT, () => {
    console.log(`Running on Port: ${PORT}`)
    console.log(new Date().toLocaleDateString())
    // bcrypt.hash('admin', 10, function(err, hash) {
    //     if (err) { throw (err); }
    //     console.log(hash)


    // });
    // bcrypt.compare('admin', "$2b$10$euDMRU6e.D/EqCUv9.lCQeZfRTznGyDcGR12HLYReWAW1EJ4FMrBS", function(err, result) {
    //     if (err) { throw (err); }
    //     console.log(result);
    // });
    // db.connect()

    // db.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
    //     if (err) throw err

    //     console.log('The solution is: ', rows[0].solution)
    // })

    // db.query('SHOW TABLES;', (err, rows, fields) => {
    //     if (err) throw err

    //     console.log('The solution is: ', rows)
    // })


});