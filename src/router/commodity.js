const express = require('express');
const multer = require('multer');
const Commodity = require('../models/commodity');
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

// 新增商品
router.post('/commodity', authToken, upload.single('photo'), async(req, res) => {

    // 如果有上傳圖片
    if (req.file) {
        // 將圖片buffer新增到req.body上
        req.body.photo = req.file.buffer;
    }

    // 新增商品資料
    const commodity = new Commodity({ 
        ...req.body, // 擴充套件運算子(spread operator)
        owner: req.user._id //連接user
    });
    await commodity.save();
    res.send(commodity);
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

// 更新商品
router.patch('/commodity/:id', authToken, upload.single('photo'), async(req, res) => {
    try {
        // 只能更新 'name', 'description', 'material', 'price', 'stock', 'photo'
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'description', 'material', 'price', 'stock', 'photo'];
        const isValidUpdates = updates.every((update) => allowedUpdates.includes(update));

        // 無法更新 無效屬性
        if (!isValidUpdates) {
            res.status(400).send({ error: 'Invalid update' });
        }
        
        const commodity = await Commodity.findById(req.params.id);
        // 如果找不到商品
        if (!commodity) {
            res.staus(404).send();
        }

        // 更新資料
        updates.forEach((u) => commodity[u] = req.body[u]);

        // 若有更新商品圖片
        if (req.file) {
            commodity.photo = req.file.buffer;
        }
        await commodity.save();
        res.send(commodity);

    } catch (e) {
        res.status(400).send();
    }
}, (error, req, res, next) => {
    // multer error
    res.status(400).send({ error: error.message });
});

// 刪除商品
router.delete('/commodity/:id', authToken, async (req, res) => {
    try {
        // 由商品id＋owner id來刪除商品
        const commodity = await Commodity.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        // 若找不到商品
        if (!commodity) {
            res.status(404).send();
        }
        res.send(commodity);
    } catch (e) {
        res.status(500).send();
    }
});

// 取得賣場所有商品
// GET /commodityAll?limit=10&skip=0
// GET /commodityAll?sortBy=createdAt:desc
router.get('/commodityAll', async (req, res) => {
    const sort = {};

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        // 判斷sortBy, desc=-1 asc=1
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try {
        const commodity = await Commodity.find(
            {}, // 搜索全部的商品
            null, // optional fields to return
            { 
                limit: parseInt(req.query.limit), //一頁最多顯示幾項資料
                skip: parseInt(req.query.skip), //要跳過幾項資料 EX: skip=2 從第3項資料開始顯示
                sort 
            }).exec();
        res.send(commodity);
    } catch (e) {
        res.status(500).send(e);
    }
});

// 取得user的所有商品
// GET /commodityAll?limit=10&skip=0
// GET /commodityAll?sortBy=createdAt:desc
router.get('/commodity/', authToken, async (req, res) => {
    const sort = {};

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        // 判斷sortBy, desc=-1 asc=1
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    try {
        await req.user.populate({
            path: 'commodity', //要populate的欄位
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.commodity);
    } catch (e) {
        res.status(500).send(e);
    }    
});


module.exports = router;