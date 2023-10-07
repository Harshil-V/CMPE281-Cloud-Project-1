import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
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

app.get('/db')

app.post('/register', (req, res) => {
    const sql = "INSERT INTO USERS (`username`, `firstname`, `lastname`, `password`) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) return res.json({ Error: "Error for hashing password" });

        const values = [
            req.body.username,
            req.body.firstname,
            req.body.lastname,
            hash
        ]

        db.query(sql, [values], (err, result) => {
            if (err) return res.json({Error: "Inserting Data Error In Server"});
            return res.json({Status: "Success"});
        });

        // const res = await pool.query(sql, values)

    });
    console.log(req.body.username);
})

app.listen(PORT, () => {
    console.log(`Running on Port: ${PORT}`)
    db.connect()

    db.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
        if (err) throw err

        console.log('The solution is: ', rows[0].solution)
    })

    db.end()
});