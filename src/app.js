const express = require('express');
require('./db/mongoose'); //connect MongoDB  /Users/markchen83115/mongodb/bin/mongod --dbpath=/Users/markchen83115/mongodb-data
const userRouter = require('./router/user');
const commodityRouter = require('./router/commodity');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());//auto parse Json from client side

app.use(userRouter);
app.use(commodityRouter);

app.listen(port, () => {
    console.log('Server is running', port);
});