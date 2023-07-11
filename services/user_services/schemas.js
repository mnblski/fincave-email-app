const Joi = require("joi");

/**
 * ADD GLOBAL JOIN CONFIG THAT SETS ABORT EARLY TO FALSE
 * */

const postUserSchema = Joi
  .object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    primary_email: Joi.string().email({ tlds: { allow: false } }).required(),
  })
  .options({
    abortEarly: false
});

const patchUserSchema = Joi
  .object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30),
    primary_email: Joi.string().email({ tlds: { allow: false } }),
    archived: Joi.boolean()
  })
  .options({
    abortEarly: false
});

module.exports = {
    postUserSchema,
    patchUserSchema
}