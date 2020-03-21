const express = require('express');
require('./db/mongoose'); //connect MongoDB  /Users/markchen83115/mongodb/bin/mongod --dbpath=/Users/markchen83115/mongodb-data
const userRouter = require('./router/user');
const commodityRouter = require('./router/commodity');

const app = express();

app.use(express.json());//auto parse Json from client side

app.use(userRouter);
app.use(commodityRouter);

module.exports = app;