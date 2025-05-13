const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ data: users });
    } catch (error) {
        res.status(500).json({ error: 'Không thể lấy danh sách người dùng' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'Người dùng không tồn tại' });
        }
        res.json({ data: user });
    } catch (error) {
        res.status(500).json({ error: 'Không thể lấy thông tin người dùng' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        console.log("Inside updateUser, req.user:", req.user);
        console.log("Updates:", req.body);
        if (!req.user || !req.user.id) {
            console.log("Missing req.user or req.user.id");
            return res.status(403).json({ error: 'Không có quyền truy cập' });
        }
        const updates = req.body;
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }
        updates.updatedAt = new Date();
        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
        if (!user) {
            console.error("User not found:", req.user.id);
            return res.status(404).json({ error: 'Người dùng không tồn tại' });
        }
        console.log("User updated:", user);
        res.json({ data: user });
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).json({ error: 'Không thể cập nhật người dùng' });
    }
};
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Người dùng không tồn tại' });
        }
        res.json({ data: { message: 'Xóa người dùng thành công' } });
    } catch (error) {
        res.status(500).json({ error: 'Không thể xóa người dùng' });
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'Người dùng không tồn tại' });
        }
        res.json({ data: user });
    } catch (error) {
        res.status(500).json({ error: 'Không thể lấy thông tin người dùng' });
    }
};