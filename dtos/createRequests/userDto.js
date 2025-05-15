const yup = require('yup');

const userDto = yup.object({
    fullname: yup
        .string()
        .required('Họ và tên là bắt buộc')
        .max(100, 'Họ và tên không được vượt quá 100 ký tự')
        .trim(),
    email: yup
        .string()
        .email('Email không hợp lệ')
        .required('Email là bắt buộc'),
    phone: yup
        .string()
        .matches(/^\+?[1-9]\d{8,14}$/, 'Số điện thoại không hợp lệ')
        .required('Số điện thoại là bắt buộc'),
    dob: yup
        .string()
        .matches(/^(\d{2})\/(\d{2})\/(\d{4})$/, 'Ngày sinh phải có định dạng DD/MM/YYYY')
        .required('Ngày sinh là bắt buộc')
        .test('is-valid-date', 'Ngày sinh không hợp lệ', (value) => {
            if (!value) return false;
            const [day, month, year] = value.split('/').map(Number);
            const dobDate = new Date(year, month - 1, day);
            return (
                !isNaN(dobDate.getTime()) &&
                dobDate.getDate() === day &&
                dobDate.getMonth() + 1 === month &&
                dobDate.getFullYear() === year &&
                year >= 1900 &&
                dobDate <= new Date()
            );
        }),
    gender: yup
        .string()
        .oneOf(['male', 'female', 'other'], 'Giới tính không hợp lệ')
        .required('Giới tính là bắt buộc'),
    password: yup
        .string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .required('Mật khẩu là bắt buộc'),
});

module.exports = { userDto };