const yup = require('yup');

const loginDto = yup.object({
    email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
    password: yup.string().required('Mật khẩu là bắt buộc'),
});

module.exports = { loginDto };