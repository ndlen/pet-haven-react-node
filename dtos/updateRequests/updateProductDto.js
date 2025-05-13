const yup = require('yup');

const updateProductDto = yup.object({
    name: yup.string(),
    category: yup.string(),
    price: yup.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
    picture: yup.string(),
    quantity: yup.number().min(0, 'Số lượng phải lớn hơn hoặc bằng 0'),
    status: yup.string().oneOf(['Có sẵn', 'Hết hàng'], 'Trạng thái không hợp lệ'),
});

module.exports = { updateProductDto };