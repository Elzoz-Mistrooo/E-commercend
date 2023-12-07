import { generalFields } from "../../middleware/validation.js";
import joi from "joi";



export const createOrder = joi.object({
    note: joi.string().min(1),
    address: joi.string().min(1).required(),
    phone: joi.array().items(
        joi.string().pattern(new RegExp(/^01[0-2,5]{1}[0-9]{8}$/)).required(),
    ).min(3).max(3).required(),

    couponName: joi.string(),
    paymentType: joi.string().valid("cash", "card"),
    productsjoi: joi.array().items(
        joi.object({
            productId: generalFields.id,
            quantity: joi.number().positive().integer().min(1).required()
        }).required()
    ).min(1)
})

export const CancelOrder = joi.object({
    reason: joi.string().required().min(10),
    orderId: generalFields.id
})

export const UpdateOrder = joi.object({
    status: joi.string().required().min(3).valid("delivered", "onWay"),
    orderId: generalFields.id
})