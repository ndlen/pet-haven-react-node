const yup = require('yup');

const appointmentDto = yup.object({
    fullname: yup.string().required('Tên là bắt buộc'),
    phone: yup.string().matches(/^\+?[1-9]\d{8,14}$/, 'Số điện thoại không hợp lệ').required('Số điện thoại là bắt buộc'),
    date: yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, 'Ngày phải có định dạng YYYY-MM-DD').required('Thời gian là bắt buộc'),
    service: yup.string().required('Dịch vụ là bắt buộc'),
    status: yup.string().oneOf(['Chờ xác nhận', 'Đã xác nhận', 'Hoàn thành', 'Đã hủy'], 'Trạng thái không hợp lệ').default('Chờ xác nhận'),
    userId: yup.string().required('ID người dùng là bắt buộc'),
});

module.exports = { appointmentDto };