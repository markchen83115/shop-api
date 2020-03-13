const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authToken = async (req, res, next) => {
    try {
        // 處理從http header獲取的token, 並解構token得到user.id, 再到mongodb撈取符合的user資料
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, 'secret');
        const user = await User.findOne({ _id: decode._id, 'tokens.token': token });

        // 若找不到user
        if (!user) {
            throw new Error();
        }

        // 回傳找到的user資料與token
        req.user = user;
        req.token = token;
        next();

    } catch (e) {

        // 認證失敗
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = authToken;