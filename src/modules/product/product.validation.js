import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const wishlist = joi.object({
    productId: generalFields.id
}).required()


export const createProduct = joi.object({
    name: joi.string().min(2).max(150).required(),
    description: joi.string().min(5).max(50000).required(),
    sizes: joi.array(),
    colors: joi.array(),
    stock: joi.number().integer().positive().min(1).required(),
    price: joi.number().positive().min(1).required(),
    discont: joi.number().positive().min(1),

    productId: generalFields.id,
    categoryId: generalFields.id,
    subcategoryId: generalFields.id,
    brandId: generalFields.id,

    file: joi.object({
        mainImage: joi.array().items(generalFields.file.required()).length(1).required(),
        subImages: joi.array().items(generalFields.file).min(1).max(5),
    }).required()


})
export const updateProduct = joi.object({
    name: joi.string().min(2).max(150),
    description: joi.string().min(5).max(50000),
    size: joi.array,
    colors: joi.array,
    stock: joi.number().integer().positive().min(1),
    price: joi.number().positive().min(1),
    discont: joi.number().positive().min(1),

    productId: generalFields.id,
    categoryId: generalFields.id,
    subcategoryId: generalFields.id,
    brandId: generalFields.id,

    file: joi.object({
        mainImage: joi.array().items(generalFields.file.required()).length(1),
        subImages: joi.array().items(generalFields.file).min(1).max(5),
    }).required()

})
