const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    account: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
        validate(v) {
            if (!validator.isMobilePhone(v,'zh-TW')) {
                throw new Error('Mobile Phone is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    name: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        lowercase: true,
        enum: ['male', 'female', 'other']
    },
    birthday: { //ISO
        type: String
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
        }
    }]
}, {
    timestamps: true
});

// 虛擬欄位 commodity --> 抓取user產生的commodity --> 透過populate()
userSchema.virtual('commodity', {
    ref: 'Commodity',
    localField: '_id',
    foreignField: 'owner'
});

// 管理res.send出現的屬性: password不顯示
userSchema.methods.toJSON = function () {
    const userObject = this.toObject();

    //delete userObject.photo;

    return userObject;
};

// generateAuthToken() 產生新的token
userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ _id: this.id.toString() }, 'secret', { expiresIn: '7 days' });
    this.tokens.push({ token });
    await this.save();
    return token;
};

// findByCredentials 驗證login資訊
userSchema.statics.findByCredentials = async (account, password) => {

    // 透過email資料在mongodb搜尋user
    const user = await User.findOne({ account });

    // 找不到user則回傳無法登入
    if (!user) {
        throw new Error('Unable to login');
    }

    // 驗證密碼
    const isMatch = await bcrypt.compare(password, user.password);

    // 密碼錯誤則回傳無法登入
    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
};

// save之前 先處理資料
userSchema.pre('save', async function (next) {
    
    // hash password
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;