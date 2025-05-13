const Joi = require('joi');

exports.createOrderDto = Joi.object({
    userId: Joi.string().required(),
    userFullname: Joi.string().required(),
    userPhone: Joi.string().required(),
    items: Joi.array().items(
        Joi.object({
            id: Joi.string().required(),
            name: Joi.string().required(),
            picture: Joi.string().required(),
            quantity: Joi.number().integer().min(1).required(),
            type: Joi.string().valid('food', 'service').required()
        })
    ).required(),
    total: Joi.string().required(),
    status: Joi.string().valid('Chờ xử lý', 'Chờ thanh toán', 'Đã thanh toán', 'Đã hủy').required(),
    paymentMethod: Joi.string().valid('COD', 'VietQR').required(),
});