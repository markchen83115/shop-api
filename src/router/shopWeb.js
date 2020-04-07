const express = require('express');

const router = new express.Router();

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/userProfile', (req, res) => {
    res.render('userProfile');
});

router.get('/logout', (req, res) => {
    res.render('logout');
});

router.get('/newCommodity', (req, res) => {
    res.render('newCommodity');
});

router.get('/userCommodity', (req, res) => {
    res.render('userCommodity');
});

router.get('/unauthorized', (req, res) => {
    res.render('unauthorized');
});

module.exports = router;