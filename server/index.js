// import express from 'express';
// import cors from 'cors';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
// import cookieParser from 'cookie-parser';
// import mysql from 'mysql';
// import fileUpload from 'express-fileupload';
// import AWS from 'aws-sdk';

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const fileUpload = require('express-fileupload');
const AWS = require('aws-sdk');
const serverless = require('serverless-http');
require('dotenv').config();

const PORT = 5000;
const salt = 10;

const app = express();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

app.use(express.json());
app.use(fileUpload());
// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });

app.use(cors({
    credentials: true,
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
    return res.json({ Status: "Success", name: req.name, id: req.id })
})

app.get('/test', (req, res) => {
    res.send("Hi")
});


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
    return res.json({ Status: "Success" });
})


// // ===============================================
app.post('/delete', async (req, res) => {
    console.log(req.body)
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    })

    console.log(req.body.keyFile)
    // res.json({data: req.body})
    const sql = "DELETE FROM rdscloudproject1.user_file_logs WHERE key_file = ?"

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
            if (err) return res.json({ Error: `Failed to Delete:${req.body.keyFile} entry From database` })
        })

        res.send({
            "response_code": 200,
            "Status": "Success",
            "response_data": data
        })

    })

})

app.get('/download/:keyFile', (req, res) => {
    const url = `dt294z2w0zv2t.cloudfront.net/${req.params.keyFile}`
    res.json({ Status: "Success", url: url })
})

app.post('/upload', async (req, res) => {
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    })

    const sql = "INSERT INTO rdscloudproject1.user_file_logs (`user_id`, `key_file`, `created_at`, `updated_at`, `description`) VALUES (?)";

    const values = [
        req.body.userID,
        req.files.file.name,
        new Date(), //Created
        new Date(), //Updated
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


    })

})


app.post('/update', (req, res) => {
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    })

    const sql_check_exists = `SELECT * FROM rdscloudproject1.user_file_logs WHERE key_file = '${req.files.file.name}'`

    const sql = `UPDATE rdscloudproject1.user_file_logs SET updated_at = CURRENT_TIMESTAMP, description = '${req.body.desc}', user_id = '${req.body.userID}' WHERE key_file = '${req.files.file.name}'`;

    // const values = [
    //     req.body.desc,
    //     req.body.userID,
    //     req.files.file.name,
    // ]
    // // console.log(req.files.file.name)
    // console.log(values)
    // // console.log(req.body)
    // return res.json(req.body)

    const s3 = new AWS.S3();

    const fileContent = Buffer.from(req.files.file.data, 'binary');
    const params = {
        Bucket: 'hw2-web-cloud-storage',
        Key: req.files.file.name,
        Body: fileContent
    }

    console.log(sql_check_exists);

    db.query(sql_check_exists, (err, result) => {
        if (err) return res.json({ Error: `Unable to Update Entry as ${req.files.file.name} does not exist` })

        if (result.length == 0)
            return res.json({ Status: `Unable to Update Entry as ${req.files.file.name} does not exist \n Please Go An Upload A file with ${req.files.file.name} first!!!!` })


        s3.upload(params, (err, data) => {
            if (err) {
                throw err;
            };

            db.query(sql, (err, result) => {
                if (err) return res.json({ Error: "Failed to Update Data Entry into Database" })
            })

            res.send({
                "response_code": 200,
                "Status": "Success",
                "response_data": data,
            })

        })
    })

})

app.get('/getlogs', (req, res) => {
    const sql = 'SELECT u.id, u.user_name, u.first_name, u.last_name, o.key_file, o.created_at, o.updated_at, o.description FROM rdscloudproject1.user_file_logs o JOIN rdscloudproject1.users u ON u.id = o.user_id;';

    db.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Failed to GET data from Database" });
        return res.json({ Status: "Success", data: result })
    })
});

// module.exports.handler = serverless(app);

app.listen(PORT, () => {
    console.log(`Running on Port: ${PORT}`)
    console.log(new Date().toString())
    // bcrypt.hash('admin', 10, function(err, hash) {
    //     if (err) { throw (err); }
    //     // console.log(hash)
    // });
    // bcrypt.compare('admin', "$2b$10$KPk7LktTBkxYVth6o..I3exN9Q1wvdWp8r0QynbMSBcb2szaV80W.", function(err, result) {
    //     if (err) { throw (err); }
    //     console.log(result);
    // });
    // console.log("=======================")
    // console.log(process.env.DB_HOST);
    // console.log("=======================")

    // db.connect()

    /* The commented code is executing a SQL query to select the sum of 1 + 1 from the database. It then
    logs the result of the query, which is the value 2, to the console. */
    // db.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
    //     if (err) throw err

    //     console.log('The solution is: ', rows[0].solution)
    // })

    // db.query('SHOW TABLES;', (err, rows, fields) => {
    //     if (err) throw err

    //     console.log('The solution is: ', rows)
    // })


});