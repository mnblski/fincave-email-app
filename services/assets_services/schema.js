// const postOneAssetSchema =
//     joi
//         .object({
//             name: joi.string().min(1).required(),
//             description: joi.string().min(3),
//             // collection_id: joi.string().min(16).required(),
//             // owner_id: joi.string().min(16).required(),
//             // product_id: joi.string().min(16).required(),
//         })
//         // .options({
//         //     abortEarly: false
//         // });

//         const joi = require("joi");

// /**
//  * ADD GLOBAL JOIN CONFIG THAT SETS ABORT EARLY TO FALSE
//  * */

// const assetPostSchema =
//     joi
//         .object({
//             name: joi.string().min(3).required(),
//             test: joi.string().min(3).required(),
//         })
//         .options({
//             abortEarly: false
//         });

// const assetPatchSchema =
//     joi
//         .object({
//             name: joi.string().min(3).required(),
//             test: joi.string().min(3).required(),
//         })
//         .options({
//             abortEarly: false
//         });

// module.exports = {
//     assetPostSchema,
//     assetPatchSchema
// }