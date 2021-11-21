const Joi = require('joi');

exports.CREATE_USER = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),

    age: Joi.number(),

    address: Joi.string()
    .min(3)
    .max(300)
    .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});