const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
console.log('Loaded JWT_SECRET:', process.env.JWT_SECRET);
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);

// Mock VietQR endpoint
app.get('/api/vietqr', (req, res) => {
    const orderId = req.query.orderId || 'TEST';
    res.json({
        data: [
            { "Mã GD": "123", "Mô tả": `Thanh toan don hang ${orderId}`, "Giá trị": "100000", "Số tài khoản": "0905859265" }
        ]
    });
});

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Đã kết nối với MongoDB');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Máy chủ đang chạy trên cổng ${PORT}`);
    });
}).catch((error) => {
    console.error('Lỗi kết nối MongoDB:', error);
});

