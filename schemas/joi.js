const Joi = require("joi");

const UserSchema = Joi.object({
    nickname: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{4,30}$')),

    confirmPassword: Joi.ref('password'),

    access_token: [
        Joi.string(),
        Joi.number()
    ],

    // birth_year: Joi.number()
    //     .integer()
    //     .min(1900)
    //     .max(2013),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
    // .with('username', 'birth_year')
    // .xor('password', 'access_token')
    // .with('password', 'repeat_password');

module.exports = UserSchema;