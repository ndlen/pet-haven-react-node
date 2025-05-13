const Appointment = require('../models/Appointment');

exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ date: 1 });
        res.json({ data: appointments });
    } catch (error) {
        res.status(500).json({ error: 'Không thể lấy danh sách lịch hẹn' });
    }
};

exports.createAppointment = async (req, res) => {
    try {
        const appointment = new Appointment({ ...req.body, userId: req.user.id });
        await appointment.save();
        res.status(201).json({ data: appointment });
    } catch (error) {
        res.status(500).json({ error: 'Không thể tạo lịch hẹn' });
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const updates = { ...req.body, updatedAt: new Date() };
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!appointment) {
            return res.status(404).json({ error: 'Lịch hẹn không tồn tại' });
        }
        res.json({ data: appointment });
    } catch (error) {
        res.status(500).json({ error: 'Không thể cập nhật lịch hẹn' });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) {
            return res.status(404).json({ error: 'Lịch hẹn không tồn tại' });
        }
        res.json({ data: { message: 'Xóa lịch hẹn thành công' } });
    } catch (error) {
        res.status(500).json({ error: 'Không thể xóa lịch hẹn' });
    }
};