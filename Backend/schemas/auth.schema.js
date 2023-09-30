const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email().allow("").empty("").required().messages({
    "string.email": "El email debe tener un formato válido",
    "any.required": "El email es requerido",
  }),
  password: Joi.string()
    .required()
    .allow("")
    .empty("")
    .max(100)
    .pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])/, 'password')
    .messages({
      "any.required": "El password es requerido",
      "string.pattern.base": "El password debe contener al menos un número y un carácter especial",
    }),
});

module.exports = { loginSchema };
