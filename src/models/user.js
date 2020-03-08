const mongoose = require('mongoose');
const validator = require('validator');

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
        type: Number,
        trim: true,
        unique: true
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
    },
    birthday: {
        type: Date,
    },
    avatar: {

    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;