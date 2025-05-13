const yup = require('yup');

const serviceDto = yup.object({
    nameService: yup.string().required('Tên dịch vụ là bắt buộc'),
    describe: yup.string().required('Mô tả là bắt buộc'),
    price: yup.number().min(0, 'Giá phải lớn hơn hoặc bằng 0').required('Giá là bắt buộc'),
    picture: yup.string(),
});

module.exports = { serviceDto };