const Order = require('../models/Order');
const Product = require('../models/Product');
const axios = require('axios');

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json({ data: orders });
    } catch (error) {
        console.error("Error in getAllOrders:", error);
        res.status(500).json({ error: 'Không thể lấy danh sách đơn hàng' });
    }
};

exports.getOrdersByUser = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Không tìm thấy thông tin người dùng trong token' });
        }
        const orders = await Order.find({ userId: req.user.id }).sort({ timestamp: -1 });
        res.json({ data: orders });
    } catch (error) {
        console.error("Error in getOrdersByUser:", error);
        res.status(500).json({ error: 'Không thể lấy danh sách đơn hàng của người dùng' });
    }
};

exports.createOrder = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'Không tìm thấy thông tin người dùng trong token' });
        }
        if (req.body.userId !== req.user.id.toString()) {
            return res.status(403).json({ error: 'Không có quyền tạo đơn hàng cho người dùng khác' });
        }

        if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
            return res.status(400).json({ error: 'Giỏ hàng không hợp lệ hoặc trống' });
        }

        const foodItems = req.body.items.filter(item => item.type === 'food');
        for (const item of foodItems) {
            const product = await Product.findById(item.id);
            if (!product) {
                return res.status(404).json({ error: `Sản phẩm ${item.name} không tồn tại` });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({ error: `Số lượng ${item.name} không đủ. Chỉ còn ${product.quantity} sản phẩm` });
            }
        }

        const order = new Order({ ...req.body, userId: req.user.id });
        await order.save();

        for (const item of foodItems) {
            const product = await Product.findById(item.id);
            product.quantity -= item.quantity;
            if (product.quantity <= 0) {
                product.status = 'Hết hàng';
            }
            await product.save();
        }

        res.status(201).json({ data: order });
    } catch (error) {
        console.error("Error in createOrder:", error);
        res.status(500).json({ error: error.message || 'Không thể tạo đơn hàng' });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const updates = { ...req.body, updatedAt: new Date() };
        const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!order) {
            return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
        }
        res.json({ data: order });
    } catch (error) {
        console.error("Error in updateOrder:", error);
        res.status(500).json({ error: 'Không thể cập nhật đơn hàng' });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
        }
        res.json({ data: { message: 'Xóa đơn hàng thành công' } });
    } catch (error) {
        console.error("Error in deleteOrder:", error);
        res.status(500).json({ error: 'Không thể xóa đơn hàng' });
    }
};

exports.checkPaymentStatus = async (req, res) => {
    try {
        const { orderId, total } = req.query;
        if (!orderId || !total) {
            return res.status(400).json({ error: 'Thiếu orderId hoặc total' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Đơn hàng không tồn tại' });
        }

        if (order.status !== 'Chờ thanh toán') {
            return res.json({ success: order.status === 'Đã thanh toán' });
        }

        // Gọi API VietQR thực tế để kiểm tra giao dịch
        try {
            const response = await axios.post('https://api.vietqr.io/v2/transactions-history', {
                accountNo: "0905859265",
                fromDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 24 hours
                toDate: new Date().toISOString().split('T')[0],
            }, {
                headers: {
                    Authorization: `Bearer your-vietqr-api-key` // Thay bằng API key thực tế
                }
            });

            const transactions = response.data.data || [];
            const matchingTransaction = transactions.find((tx) => {
                const description = tx.description.toUpperCase();
                const price = parseInt(tx.amount);
                const account = tx.accountNo;
                return (
                    description.includes(orderId.toUpperCase()) &&
                    price >= parseInt(total) &&
                    account === "0905859265"
                );
            });

            if (matchingTransaction) {
                await Order.findByIdAndUpdate(orderId, { status: 'Đã thanh toán' });
                return res.json({ success: true });
            } else {
                return res.json({ success: false });
            }
        } catch (apiError) {
            console.error("Lỗi khi gọi API VietQR:", apiError.response?.data || apiError.message);
            return res.status(502).json({ error: 'Không thể kiểm tra trạng thái thanh toán từ VietQR', details: apiError.message });
        }
    } catch (error) {
        console.error("Error in checkPaymentStatus:", error);
        res.status(500).json({ error: 'Lỗi khi kiểm tra trạng thái thanh toán', details: error.message });
    }
};