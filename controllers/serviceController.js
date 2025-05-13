const Service = require('../models/Service');

exports.getAllServices = async (req, res) => {
    try {
        const { page = 1, limit = 12 } = req.query;
        const services = await Service.find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await Service.countDocuments();
        res.json({ data: services, total });
    } catch (error) {
        res.status(500).json({ error: 'Không thể lấy danh sách dịch vụ' });
    }
};

exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ error: 'Dịch vụ không tồn tại' });
        }
        res.json({ data: service });
    } catch (error) {
        res.status(500).json({ error: 'Không thể lấy thông tin dịch vụ' });
    }
};

exports.createService = async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();
        res.status(201).json({ data: service });
    } catch (error) {
        res.status(500).json({ error: 'Không thể tạo dịch vụ' });
    }
};

exports.updateService = async (req, res) => {
    try {
        const updates = { ...req.body, updatedAt: new Date() };
        const service = await Service.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!service) {
            return res.status(404).json({ error: 'Dịch vụ không tồn tại' });
        }
        res.json({ data: service });
    } catch (error) {
        res.status(500).json({ error: 'Không thể cập nhật dịch vụ' });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({ error: 'Dịch vụ không tồn tại' });
        }
        res.json({ data: { message: 'Xóa dịch vụ thành công' } });
    } catch (error) {
        res.status(500).json({ error: 'Không thể xóa dịch vụ' });
    }
};