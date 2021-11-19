const CREATE_USER = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    age: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    address: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});

export {CREATE_USER};