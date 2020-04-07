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
        default: '無'
    },
    material: {
        type: String,
        default: '無'
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
    photo: {
        type: Buffer
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

// 管理res.send出現的屬性: photo不顯示
// commoditySchema.methods.toJSON = function () {
//     const commodityObject = this.toObject();

//     delete commodityObject.photo;

//     return commodityObject;
// };

const Commodity = mongoose.model('Commodity', commoditySchema);

module.exports = Commodity;