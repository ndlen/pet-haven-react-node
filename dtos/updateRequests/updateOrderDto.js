const yup = require('yup');

const updateOrderDto = yup.object({
    status: yup.string().oneOf(['Chờ xử lý', 'Chờ thanh toán', 'Đã thanh toán', 'Đã hủy'], 'Trạng thái không hợp lệ'),
});

module.exports = { updateOrderDto };