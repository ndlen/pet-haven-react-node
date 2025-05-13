const yup = require('yup');

const updateServiceDto = yup.object({
    nameService: yup.string(),
    describe: yup.string(),
    price: yup.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
    picture: yup.string(),
});

module.exports = { updateServiceDto };