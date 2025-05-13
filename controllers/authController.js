const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { fullname, email, phone, dob, gender, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email đã tồn tại' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            fullname,
            email,
            phone,
            dob,
            gender,
            password: hashedPassword,
            role: 'user',
        });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ data: { token, user: { id: user._id, fullname, email, phone, dob, gender, role: user.role } } });
    } catch (error) {
        res.status(500).json({ error: 'Không thể đăng ký người dùng' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ data: { token, user: { id: user._id, fullname: user.fullname, email, phone: user.phone, dob: user.dob, gender: user.gender, role: user.role } } });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi khi đăng nhập' });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'Người dùng không tồn tại' });
        }
        res.json({ data: { message: 'Link xác thực đã được gửi' } });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi gửi link xác thực' });
    }
};