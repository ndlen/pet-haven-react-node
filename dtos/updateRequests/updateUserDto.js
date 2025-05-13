const yup = require('yup');

const getUpdateUserSchema = yup.object({
    fullname: yup.string(),
    phone: yup.string().matches(/^\+?[1-9]\d{8,14}$/, 'Số điện thoại không hợp lệ'),
    dob: yup.string().matches(/^(\d{2})\/(\d{2})\/(\d{4})$/, 'Ngày sinh phải có định dạng DD/MM/YYYY'),
    gender: yup.string().oneOf(['male', 'female', 'other'], 'Giới tính không hợp lệ'),
    password: yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

module.exports = { getUpdateUserSchema };