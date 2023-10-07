import express from 'express';
import cors from 'cors';
// import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import mysql from 'mysql';


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
app.use(cors());
app.use(cookieParser());

// app.post('/upload', async (req, res) => {
//     const fileContent = Buffer.from(req.file.data.image, 'binary');
//     console.log(fileContent)
//     console.log(req.data)
// });



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
            if (err) return res.json({Error: err});
            return res.json({Status: "Success"});
        });

        // const res = await pool.query(sql, values)

    });
    // console.log(req.body.username);
})

app.post('/login', (req, res) => {

    const sql = "SELECT * FROM users WHERE user_name = ?";
    db.query(sql, [req.body.username], (err, data) => {
        if (err) return res.json({Error: "Login Error in Server"})
        if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, function(err, response) {
                if (err) return res.json({Error: "Password Compare Error"});
                if (response) {
                    return res.json({Status: "Success"});
                } else {
                    return res.json({Error: "Password not matched"});
                }
            })
        } else {
            return res.json({Error: "Username does not exist"})
        }
    })
});


app.listen(PORT, () => {
    console.log(`Running on Port: ${PORT}`)

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