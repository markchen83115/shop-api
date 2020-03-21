const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const authToken = require('../middleware/authToken');

const router = new express.Router();

// multer設定 上傳檔案
const upload = multer({
    // 檔案大小限制1MB
    limits: { fieldSize: 1000000 },
    // 限制檔案類型 jpg, jpeg, png
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a jpg, jpeg, png file'));
        }
        cb(undefined, true);
    }
});

// 建立新user
router.post('/users', async(req, res) => {
    const user = new User(req.body);
    try {
        // 儲存user資料, 並產生新的token
        await user.save();
        const token = await user.generateAuthToken();
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

// user登出
router.post('/users/logout', authToken, async (req, res) => {
    try {
        // 移除現有的token並存檔
        req.user.tokens = req.user.tokens.filter((t) => t.token !== req.token);
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

// user清除所有token
router.post('/users/logoutAll', authToken, async (req, res) => {
    try {
        // 清除所有tokens並存檔
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

// 獲取user自己的資料 會先驗證token
router.get('/users/me', authToken, async (req, res) => {
    // user資料已從authToken回傳至req.user
    res.send(req.user);
});

// 更新user資料 先驗證token
router.patch('/users/me', authToken, async (req, res) => {
    // 只能更新 'email', 'password', 'phone', 'name', 'gender', 'birthday'
    const updates = Object.keys(req.body);
    const allowedUpdates = ['email', 'password', 'phone', 'name', 'gender', 'birthday'];
    const isValidUpdates = updates.every((update) => allowedUpdates.includes(update));

    // 無法更新 無效屬性
    if (!isValidUpdates) {
        return res.status(400).send({ error: 'invalid updates' });
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

// 刪除user
router.delete('/users/me', authToken, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
});

// 上傳個人頭像
router.post('/users/me/avatar', authToken, upload.single('avatar'), async (req, res) => { // upload.single('avatar'): avatar代表的是Json裡面的key
    // resize(裁剪圖片大小) --> png(轉換為png檔) --> toBuffer(轉變資料型態為buffer) 
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();

    // Express error handler
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

//刪除個人頭像
router.delete('/users/me/avatar', authToken, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send(); 
    } catch (e) {
        res.status(500).send();
    }
});

//讓使用者可以獲取自己的頭像
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }
        
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
});


module.exports = router;