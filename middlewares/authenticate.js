const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Không có token, vui lòng đăng nhập' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const User = require('../models/User');
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ error: 'Người dùng không tồn tại' });
        }

        req.user = {
            id: user._id.toString(),
            role: user.role || 'user',
            email: user.email
        };
        console.log('Authenticated user:', req.user);
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Token không hợp lệ' });
    }
};