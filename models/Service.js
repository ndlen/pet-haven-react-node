const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    nameService: { type: String, required: true },
    describe: { type: String, required: true },
    price: { type: Number, required: true },
    picture: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Service', serviceSchema);