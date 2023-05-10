const joi = require("joi");

/**
 * ADD GLOBAL JOIN CONFIG THAT SETS ABORT EARLY TO FALSE
 * */

const userPostSchema =
    joi
        .object({
            username: joi.string().min(3).required(),
            password: joi.string().min(3).required(),
        })
        .options({
            abortEarly: false
        });

const userPatchSchema =
    joi
        .object({
            name: joi.string().min(3).required(),
            test: joi.string().min(3).required(),
        })
        .options({
            abortEarly: false
        });

module.exports = {
    userPostSchema,
    userPatchSchema
}