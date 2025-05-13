const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    service: { type: String, required: true },
    status: { type: String, enum: ['Chờ xác nhận', 'Đã xác nhận', 'Hoàn thành', 'Đã hủy'], default: 'Chờ xác nhận' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedEmployee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Appointment', appointmentSchema);