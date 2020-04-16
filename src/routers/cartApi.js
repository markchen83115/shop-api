const express = require('express');
const Cart = require('../models/cart');
const authToken = require('../middleware/authToken');

const router = new express.Router();

// 新增商品至購物車 (商品頁面)
router.post('/api/cart', authToken, async(req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        
        if (!cart) { // 若無購物車 則新增購物車
            const newCart = new Cart({
                cartItem: [{
                    ...req.body
                }],
                userId: req.user._id //連接user
            });
            await newCart.save();
            res.status(201).send(newCart);

        } else { // 若已有購物車 則檢視購物車商品
            const index = cart.cartItem.findIndex((item) => item.commodityId.toString() === req.body.commodityId)
                
            if (index === -1) { // 無相同商品 則新增商品到購物車
                cart.cartItem.push({
                    commodityId: req.body.commodityId,
                    quantity: req.body.quantity
                });
                await cart.save();

            } else { // 有相同商品 直接增加數量
                cart.cartItem[index].quantity += Number(req.body.quantity);
                await cart.save();
            }
            res.status(201).send(cart);
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

// 更改購物車的單一商品數量 (購物車頁面)
router.patch('/api/cart/:commodityId', authToken, async(req, res) => {
    try {
        const cId = req.params.commodityId;

        // 只能更新quantity
        const updates = Object.keys(req.body);
        const allowedUpdates = ['quantity'];
        const isValidUpdates = updates.every((update) => allowedUpdates.includes(update));
    
         // 無法更新 無效屬性
         if (!isValidUpdates) {
            return res.status(400).send({ error: 'Invalid update' });
        }

        // 根據userId搜尋cart
        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            return res.status(404).send();
        }
        // 搜尋相對應的commodityId 更改商品數量
        cart.cartItem.forEach((item) => {
            if (item.commodityId.toString() === cId) {
                item.quantity = req.body.quantity;
            }
        });
        await cart.save();
        res.send(cart);
    } catch (e) {
        res.status(400).send(e);
    }
});

// 取得購物車內容
router.get('/api/cart/me', authToken, async(req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).send();
        }
        res.send(cart);

    } catch (e) {
        res.send(500).send(e);
    }
});

// 刪除購物車
router.delete('/api/cart', authToken, async(req, res) => {
    try {
        const cart = await Cart.deleteOne({ userId: req.user._id });
        res.send(cart);
    } catch (e) {
        res.status(400).send(e);
    }
});

// 刪除購物車內單一商品
router.delete('/api/cart/:commodityId', authToken, async(req, res) => {
    try {
        const cId = req.params.commodityId;
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).send();
        }
        // 移除單一商品
        cart.cartItem = cart.cartItem.filter((item) => item.commodityId.toString() !== cId);
        await cart.save();
        res.send(cart);
    } catch (e) {
        res.status(400).send(e);
    }
});





module.exports = router;