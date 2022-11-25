const bodyParser = require('body-parser');
const express = require('express');
const { connection } = require('./config/db');


const app = express();

// Middlewres
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended : false }))

app.get("/", async(req,res) => {
    res.send("Hello from my side")
})

app.listen(8080, async(req,res) => {
    try {
        await connection
        console.log("DB is connected on port 8080")
    } catch (error) {
        console.log(`Fetching some error, while connecting with DB ${error}`)
    }
    console.log("DB is connected successfully")
})