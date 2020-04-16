const express = require('express');
const path = require('path');
const userApiRouter = require('./router/userApi');
const commodityApiRouter = require('./router/commodityApi');
const cartApiRouter = require('./router/cartApi');
const orderApiRouter = require('./router/orderApi');
const shopWebRouter = require('./router/shopWeb');

// 連接mongodb
require('./db/mongoose'); // /Users/markchen83115/mongodb/bin/mongod --dbpath=/Users/markchen83115/mongodb-data

const app = express();
app.use(express.json());//auto parse Json from client side

// URL
app.use(userApiRouter);
app.use(commodityApiRouter);
app.use(cartApiRouter);
app.use(orderApiRouter);
app.use(shopWebRouter);

// 定義路徑
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');

// 設定ejs
app.set('view engine', 'ejs');
app.set('views', viewsPath);
app.use(express.static(publicDirectoryPath));



module.exports = app;