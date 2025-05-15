const mongoose = require('mongoose');
const { isEmail, isMobilePhone } = require('validator');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Fullname is required'],
        trim: true,
        maxlength: [100, 'Fullname cannot exceed 100 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false,
    },
    phone: {
        type: String,
        validate: {
            validator: (v) => isMobilePhone(v, 'any', { strictMode: false }),
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    dob: {
        type: String,
        required: [true, 'Date of birth is required'],
        validate: {
            validator: (v) => /^(\d{2})\/(\d{2})\/(\d{4})$/.test(v),
            message: 'Date of birth must be in DD/MM/YYYY format',
        },
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: [true, 'Gender is required'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['admin', 'staff', 'user'],
        default: 'user',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);