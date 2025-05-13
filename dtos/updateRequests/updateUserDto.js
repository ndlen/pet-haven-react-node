const Joi = require('joi');

exports.getUpdateUserSchema = Joi.object({
    fullname: Joi.string().min(2).max(100).optional(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{8,14}$/).optional(),
    dob: Joi.string().pattern(/^(\d{2})\/(\d{2})\/(\d{4})$/).optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    password: Joi.string().min(6).optional().allow(''),
    role: Joi.string().valid('user', 'staff', 'admin').optional(),
    isVerified: Joi.boolean().optional()
});