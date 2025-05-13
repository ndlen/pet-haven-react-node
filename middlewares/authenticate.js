const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token received:', token);
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ error: 'Không có token, vui lòng đăng nhập' });
    }
    try {
        console.log('JWT_SECRET:', process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.log('Token verification error:', error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token đã hết hạn, vui lòng đăng nhập lại' });
        }
        return res.status(403).json({ error: 'Không có quyền truy cập' });
    }
};