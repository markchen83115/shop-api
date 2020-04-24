const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/order');
const Cart = require('../models/cart');
const Commodity = require('../models/commodity');
const authToken = require('../middleware/authToken');

const router = new express.Router();

router.post('/api/order', authToken, async (req, res) => {
    // transactions
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let orderItem = [];

        // 先讀取每個commodityId 取得commdity最新資料
        for (let i = 0, len = req.body.items.length; i < len; i++) {
            const commodity = await Commodity.findById(req.body.items[i].commodityId, null, { session });

            // 商品是否已下架
            if (!commodity) {
                return res.status(404).send();
            }

            // 檢查庫存是否足夠
            if (commodity.stock < Number(req.body.items[i].quantity)) {
                return res.status(400).send({ error: `庫存不足`, commodityId: commodity._id, name: commodity.name });
            }

            // 將資料丟入orderItem
            orderItem.push({
                commodityId: req.body.items[i].commodityId,
                name: commodity.name,
                price: commodity.price,
                quantity: Number(req.body.items[i].quantity)
            });
        }

        // 更新商品庫存 扣除被下單的數量
        for (let i = 0, len = req.body.items.length; i < len; i++) {
            const commodity = await Commodity.findById(req.body.items[i].commodityId, null, { session });
            commodity.stock -=  Number(req.body.items[i].quantity);
            await commodity.save({ session });
        }

        // 新增order
        const order = new Order({
            userId: req.user._id,
            orderItem: orderItem
        });
        await order.save({ session });

        // order儲存後 將購物車刪除
        await Cart.deleteOne({ userId: req.user._id }, { session });

        await session.commitTransaction();
        session.endSession();
        res.status(201).send(order);

    } catch (e) {
        // If an error occurred, abort the whole transaction
        await session.abortTransaction();
        session.endSession();
        console.log(e);
        res.status(400).send(e);
    }
});

// GET /api/order/me?limit=10&skip=0
// GET /api/order/me?sortBy=createdAt:desc
// GET /api/order/me?completed=true
router.get('/api/order/me', authToken, async (req, res) => {
    try {
        // 處理query: sort
        const sort = {};
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1; //if判斷式的 ternary operator
        }

        // 處理query: completed = true / false
        if (req.query.completed) { // query裡面有completed
            const completed = req.query.completed === 'true';
            const order = await Order.find(
                { userId: req.user._id, completed: completed },
                null,
                {
                    limit: parseInt(req.query.limit), //一頁最多顯示幾項資料
                    skip: parseInt(req.query.skip), //要跳過幾項資料 EX: skip=2 從第3項資料開始顯示
                    sort 
                });
            return res.send(order);   
        }

        // query裡面沒有completed
        const order = await Order.find(
            { userId: req.user._id },
            null,
            {
                limit: parseInt(req.query.limit), //一頁最多顯示幾項資料
                skip: parseInt(req.query.skip), //要跳過幾項資料 EX: skip=2 從第3項資料開始顯示
                sort
            });
        if (!order) {
            return res.status(404).send();
        }
        res.send(order);

    } catch (e) {
        res.status(500).send(e);
    }
});

router.patch('/api/order/:orderId', authToken, async (req, res) => {
    try {
        const oId = req.params.orderId;

        // 只能更新completed
        const updates = Object.keys(req.body);
        const allowedUpdates = ['completed'];
        const isValidUpdates = updates.every((update) => allowedUpdates.includes(update));
    
         // 無法更新 無效屬性
         if (!isValidUpdates) {
            return res.status(400).send({ error: 'Invalid update' });
        }

        const order = await Order.findOne({ userId: req.user._id, _id: oId });
        if (!order) {
            return res.status(404).send();
        }
        
        // 更新order.completed
        order.completed = req.body.completed;
        await order.save();
        res.send(order);

    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/api/order/:orderId', authToken, async (req, res) => {
    try {
        const oId = req.params.orderId;

        const order = await Order.findOne({ userId: req.user._id, _id: oId });
        if (!order) {
            return res.status(404).send();
        }
        await order.remove();
        res.send(order);

    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;