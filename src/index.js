require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const route = require('./routes/route.js');
const multer = require('multer')


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().any())


const port = process.env.PORT
const url = process.env.MONGODB_URL

mongoose.connect(url, {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route);

app.use(function (req, res) {
    return res.status(400).send({ status: false, message: "Path not found, please provide correct path" })
})


app.listen(port, function () {
    console.log('Express app running on port ' + (port))
})
