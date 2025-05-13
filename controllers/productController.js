const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 12, category } = req.query;
        const query = category ? { category } : {};
        const products = await Product.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await Product.countDocuments(query);
        res.json({ data: products, total });
    } catch (error) {
        res.status(500).json({ error: 'Không thể lấy danh sách sản phẩm' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        }
        res.json({ data: product });
    } catch (error) {
        res.status(500).json({ error: 'Không thể lấy thông tin sản phẩm' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ data: product });
    } catch (error) {
        res.status(500).json({ error: 'Không thể tạo sản phẩm' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updates = { ...req.body, updatedAt: new Date() };
        const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!product) {
            return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        }
        res.json({ data: product });
    } catch (error) {
        res.status(500).json({ error: 'Không thể cập nhật sản phẩm' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        }
        res.json({ data: { message: 'Xóa sản phẩm thành công' } });
    } catch (error) {
        res.status(500).json({ error: 'Không thể xóa sản phẩm' });
    }
};