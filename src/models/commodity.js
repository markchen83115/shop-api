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
        validate(v) {
            if (!validator.isInt(v, {min: 1})) {
                throw new Error('Price must >1');
            }
        }
    },
    stock: {
        type: Number,
        required: true,
        validate(v) {
            if (!validator.isInt(v,)) {
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