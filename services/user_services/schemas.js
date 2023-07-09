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
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(), /** min 6 chars */
  })
  .options({
    abortEarly: false
});



module.exports = {
    postUserSchema
}