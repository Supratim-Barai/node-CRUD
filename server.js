var http = require('http'); // 1 - Import Node.js core module
var express = require('express');
var app = express();
var routes = require('./routes/index');
const mongoose = require('mongoose');
var bodyParser = require("body-parser");

//............................BodyParser................................//

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//........................MongoDb Connect...............................//

mongoose.connect('mongodb+srv://supratim:supi1234@cluster0.cu67u.mongodb.net/User',
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
).then(() => {
    console.log("connection to database established")
})
    .catch(err => {
        console.log("db error", err);
        process.exit(-1)
    })


//...............................server.......................................//

app.use(routes)

var server = app.listen(5000, function () {
    console.log('Node server is running..');
});