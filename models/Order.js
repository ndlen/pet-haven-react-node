const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userFullname: { type: String, required: true },
    userPhone: { type: String, required: true },
    items: [{
        id: { type: String, required: true },
        name: { type: String, required: true },
        picture: { type: String },
        quantity: { type: Number, required: true },
    }],
    total: { type: String, required: true },
    status: { type: String, enum: ['Chờ xử lý', 'Chờ thanh toán', 'Đã thanh toán', 'Đã hủy'], default: 'Chờ xử lý' },
    paymentMethod: { type: String, enum: ['COD', 'VietQR'], required: true },
    timestamp: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);