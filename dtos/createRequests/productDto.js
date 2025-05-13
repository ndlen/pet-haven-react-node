const yup = require('yup');

const productDto = yup.object({
    name: yup.string().required('Tên sản phẩm là bắt buộc'),
    category: yup.string().required('Danh mục là bắt buộc'),
    price: yup.number().min(0, 'Giá phải lớn hơn hoặc bằng 0').required('Giá là bắt buộc'),
    picture: yup.string(),
    quantity: yup.number().min(0, 'Số lượng phải lớn hơn hoặc bằng 0').required('Số lượng là bắt buộc'),
    status: yup.string().oneOf(['Có sẵn', 'Hết hàng'], 'Trạng thái không hợp lệ').default('Có sẵn'),
});

module.exports = { productDto };