const yup = require('yup');

const updateAppointmentDto = yup.object({
    fullname: yup.string(),
    phone: yup.string().matches(/^\+?[1-9]\d{8,14}$/, 'Số điện thoại không hợp lệ'),
    date: yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Ngày phải có định dạng YYYY-MM-DD'),
    service: yup.string(),
    status: yup.string().oneOf(['Chờ xác nhận', 'Đã xác nhận', 'Hoàn thành', 'Đã hủy'], 'Trạng thái không hợp lệ'),
});

module.exports = { updateAppointmentDto };