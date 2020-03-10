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
        // unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        // unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    phone: {
        type: String,
        trim: true,
        // unique: true,
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
        type: String,
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            // required: true
        }
    }]
}, {
    timestamps: true
});

//generateAuthToken()  create Token
userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ _id: this.id.toString() }, 'markchen83115', { expiresIn: '7 days' });
    this.tokens.push({ token });
    await this.save();
    return token;
};

//middleware - hash password, ISO birthday before save()
userSchema.pre('save', async function(next) {
    const user = this; //avoid point to global variables

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    if (user.isModified('birthday')) {
        const birthday = moment(user.birthday, "YYYY-MM-DD");
        user.birthday = birthday.toISOString();
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;