const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.updateUser = async (req, res) => {
    try {
        // Determine userId based on route
        const userId = req.params.id && req.params.id !== 'me' ? req.params.id : req.user.id;
        let updateData = { ...req.body, updatedAt: new Date() };
        console.log('Update user request:', { userId, updateData });

        // Remove sensitive fields if not admin
        const isAdmin = req.user && req.user.role === 'admin';
        if (!isAdmin) {
            const { isVerified, role, ...filteredData } = updateData;
            updateData = filteredData;
        }

        // Hash password if provided and non-empty
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        } else {
            delete updateData.password; // Remove empty password
        }

        // Prevent email updates
        delete updateData.email;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            console.error('User not found:', userId);
            return res.status(404).json({ error: 'Người dùng không tồn tại' });
        }

        console.log('User updated:', updatedUser);
        res.json({ data: updatedUser, message: 'Cập nhật thông tin người dùng thành công' });
    } catch (error) {
        console.error('Error in updateUser:', error.message, error.stack);
        res.status(500).json({ error: 'Không thể cập nhật thông tin người dùng', details: error.message });
    }
};

// Keep other functions (getAllUsers, getUserById, etc.) as is
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