const express = require('express');
const User = require('../models/user');
const authToken = require('../middleware/authToken');

const router = new express.Router();

// 建立新user
router.post('/users', async(req, res) => {
    const user = new User(req.body);
    try {
        // 儲存user資料, 並產生新的token
        await user.save();
        console.log('a');
        const token = await user.generateAuthToken();
        console.log('b');
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

// user登入
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.account, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
    
});

// 獲取user自己的資料 會先驗證token
router.get('/users/me', authToken, async (req, res) => {
    // user資料已從authToken回傳至req.user
    res.send(req.user);
});

// 更新user資料 先驗證token
router.patch('/users/me', authToken, async (req, res) => {
    // 只能更新 'email', 'password', 'phone', 'name', 'gender', 'birthday', 'avatar'
    const updates = Object.keys(req.body);
    const allowedUpdates = ['email', 'password', 'phone', 'name', 'gender', 'birthday', 'avatar'];
    const isValidUpdates = updates.every((update) => allowedUpdates.includes(update));

    // 無法更新未包含的資料
    if (!isValidUpdates) {
        res.status(400).send({ error: 'invalid updates' });
    }

    try {
        // 根據使用者傳送的資料進行更新並儲存
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});



module.exports = router;