const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Cấu hình CORS
app.use(cors({
    origin: 'http://localhost:3001', // Cho phép nguồn từ ứng dụng React
    methods: ['GET', 'OPTIONS'], // Cho phép các phương thức cần thiết
    allowedHeaders: ['Content-Type', 'Cache-Control', 'Pragma', 'Expires'], // Cho phép các tiêu đề tùy chỉnh
}));

app.get('/api/vietqr', async (req, res) => {
    try {
        const response = await axios.get('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLi6vXDvN0YAsVKuCE7db0SYikTzmgvT7YhG6kjY863-vLUv3VEjTG2SUjSitmHdoCVGAS8bHcu2ecssnseRn9y4dRVLPNzFUCLR7wmN1ZGWM6WIJ1Bfohkdo55NySIFvYQBUlDU9RpSWKai49oVw2UAuaVW51LAt9PsYwDt3IZK0Ov7oCCb-8hsAJoZcT-NQVgl939_tWfFWxgGWcgE8bXwoMOwoIdm4astsl0mTNlPPk2SKMe4W-mUNQ9dly1Vvark8jrIPu02nLIgYxP9dEk2D6X2kf0VAAn956f3&lib=MTZzoeMzWub-h0GpCQnTpQeOqZAzN-h83');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching VietQR data:', error.message);
        res.status(500).json({ error: 'Failed to fetch VietQR data' });
    }
});

app.listen(3002, () => console.log('Proxy running on port 3002'));