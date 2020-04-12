const express = require('express');
const path = require('path');
const userAPIRouter = require('./router/userAPI');
const commodityAPIRouter = require('./router/commodityAPI');
const cartAPIRouter = require('./router/cartAPI');
const shopWebRouter = require('./router/shopWeb');

// 連接mongodb
require('./db/mongoose'); // /Users/markchen83115/mongodb/bin/mongod --dbpath=/Users/markchen83115/mongodb-data

const app = express();
app.use(express.json());//auto parse Json from client side

// 定義路徑
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');

// 設定ejs
app.set('view engine', 'ejs');
app.set('views', viewsPath);
app.use(express.static(publicDirectoryPath));

// URL
app.use(userAPIRouter);
app.use(commodityAPIRouter);
app.use(cartAPIRouter);
app.use(shopWebRouter);

module.exports = app;