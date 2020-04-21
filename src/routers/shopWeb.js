const express = require('express');
const rp = require('request-promise');

const router = new express.Router();

router.get('', (req, res) => {
    res.render('commodityAll');
});

router.get('/userRegister', (req, res) => {
    res.render('userRegister');
});

router.get('/userLogin', (req, res) => {
    res.render('userLogin');
});

router.get('/userGoogleOAuth', (req, res) => {
    res.render('userGoogleOAuth');
});

router.get('/userProfile', (req, res) => {
    res.render('userProfile');
});

router.get('/userUnauthorized', (req, res) => {
    res.render('userUnauthorized');
});

router.get('/userUpdatePassword', (req, res) => {
    res.render('userUpdatePassword');
});

router.get('/commodityNew', (req, res) => {
    res.render('commodityNew');
});

router.get('/commodityUser', (req, res) => {
    res.render('commodityUser');
});

router.get('/commodityAll', (req, res) => {
    res.render('commodityAll');
});

router.get('/commodity/:commodityId', async (req, res) => {
    const _id = req.params.commodityId;
    const options = {
        url: `https://markchen-shopping-web.herokuapp.com/api/commodity/${_id}`,
        json: true
    };
    const commodity = await rp(options);
    res.render('commodityOne', commodity);
});

router.get('/commodityMod/:commodityId', async (req, res) => {
    const _id = req.params.commodityId;
    const options = {
        url: `https://markchen-shopping-web.herokuapp.com/api/commodity/${_id}`,
        json: true
    };
    const commodity = await rp(options);
    res.render('commodityMod', commodity);
});

router.get('/cart', async(req, res) => {
    res.render('cartList');
});

router.get('/order', async(req, res) => {
    res.render('orderList');
});



module.exports = router;