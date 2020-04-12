const mongoose = require('mongoose');
const validator = require('validator');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    cartItem: [{
        commodityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Commoidty'
        },
        quantity: {
            type: Number,
            min: 1,
            validate(v) {
                if (!validator.isInt(v.toString())) {
                    throw new Error('Stock must be integer');
                }
            }
        }
    }]
}, {
    timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;