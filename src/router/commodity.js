const express = require('express');
const Commodity = require('../models/commodity');

const router = new express.Router();

//create commodity
router.post('/commodity', async(req, res) => {
    const commodity = new Commodity(req.body);

    try {
        await commodity.save();
        res.status(201).send(commodity);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;