const mongoose = require('mongoose');
const validator = require('validator');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItem: [{
        commodityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Commodity'
        },
        name: {
            type: String,
            required: true,
            maxlength: 60 
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
        quantity: {
            type: Number,
            required: true,
            min: 1,
            validate(v) {
                if (!validator.isInt(v.toString())) {
                    throw new Error('Stock must be integer');
                }
            }
        }
    }],
    completed: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;