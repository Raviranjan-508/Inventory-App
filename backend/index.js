const bodyParser = require('body-parser');
const express = require('express');
const { connection } = require('./config/db');
const { userRouter } = require('./routes/userRoute');
const cookieParser = require("cookie-parser");
const { productRouter } = require('./routes/productRoute');

const app = express();
const PORT = 8080;

// Middlewres
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended : false }))


app.use("/", userRouter);
app.use("/", productRouter);

app.get("/", async(req,res) => {
    res.send("Hello from my side")
})

app.listen(PORT, async(req,res) => {
    try {
        await connection
        console.log("DB is connected on port 8080")
    } catch (error) {
        console.log(`Fetching some error, while connecting with DB ${error}`)
    }
    console.log("DB is connected successfully")
})