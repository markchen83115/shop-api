const mongoose = require('mongoose');
const validator = require('validator');

const commoditySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 60 
    },
    description: {
        type: String,
        maxlength: 3000,
        required: true
    },
    material: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 1,
        validate(v) {
            if (!validator.isInt(v.toString())) {
                throw new Error('Price must be integer');
            }
        }
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        validate(v) {
            if (!validator.isInt(v.toString())) {
                throw new Error('Stock must be integer');
            }
        }
    },
    photo: [{
        type: Buffer
    }],
    owner: {
        type: String,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Commodity = mongoose.model('Commodity', commoditySchema);

module.exports = Commodity;