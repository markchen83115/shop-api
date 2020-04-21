const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const passport = require('passport');
const commodityApiRouter = require('./routers/commodityApi');
const userApiRouter = require('./routers/userApi');
const cartApiRouter = require('./routers/cartApi');
const orderApiRouter = require('./routers/orderApi');
const shopWebRouter = require('./routers/shopWeb');
const passportSetup = require('./passport');

// 連接mongodb
require('./db/mongoose'); // /Users/markchen83115/mongodb/bin/mongod --dbpath=/Users/markchen83115/mongodb-data

const app = express();
app.use(express.json());//auto parse Json from client side

// 設定cookie session
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// URL
app.use(commodityApiRouter);
app.use(cartApiRouter);
app.use(orderApiRouter);
app.use(userApiRouter);
app.use(shopWebRouter);


// 定義路徑
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');

// 設定ejs
app.set('view engine', 'ejs');
app.set('views', viewsPath);
app.use(express.static(publicDirectoryPath));


module.exports = app;