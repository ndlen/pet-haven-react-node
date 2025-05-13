const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    picture: { type: String },
    quantity: { type: Number, required: true },
    status: { type: String, enum: ['Có sẵn', 'Hết hàng'], default: 'Có sẵn' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);