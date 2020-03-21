const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authToken = async (req, res, next) => {
    try {
        // 處理從http header獲取的token, 並解構token得到user id, 從DB中撈出user資料
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decode._id, 'tokens.token': token });

        // 找不到user資料
        if (!user) {
            throw new Error();
        }

        // 回傳user資料與token
        req.user = user;
        req.token = token;
        next();

    } catch (e) {

        // 認證失敗
        res.status(401).send({ error: 'Please authenticate' });
    }
};

module.exports = authToken;