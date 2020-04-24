const redis = require('redis');
const asyncRedis = require('async-redis');
const mongoose = require('mongoose');

const client = redis.createClient(process.env.REDIS_URL);
const asyncRedisClient = asyncRedis.decorate(client);

//brew services start redis

// cache middleware - all commodity
const cacheAllCommodity = async (req, res, next) => {
    try {
        // 如果有query
        if (req.query) {
            return next();
        }

        const value = await asyncRedisClient.get('numCommodity');
        // 沒有資料則回傳next()
        if (!value) {
            return next();
        }
        // 取得商品總數
        let commodity = [];
        const number = Number(value);
        for(let i = 0; i < number; i ++) {
            const data = await asyncRedisClient.hgetall(`commodity:${i}`);
            const item = {
                description: data.description,
                material: data.material,
                _id: mongoose.Types.ObjectId(data._id),
                name: data.name,
                price: Number(data.price),
                stock: Number(data.stock),
                owner: mongoose.Types.ObjectId(data.owner),
                createdAt: data.createdAt,
                updatedAt: data.updatedAt
            };
            commodity.push(item);
        }
        res.send(commodity);
    } catch (err) {
        res.status(500).send(err);
    }
    
};

module.exports = {client, cacheAllCommodity};