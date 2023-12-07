import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'





export const CreateCoupon = joi.object({
    amount: joi.number().positive().min(1).max(100).required(),
    name: joi.string().min(3).max(25).required(),
    expireDate: joi.date().greater(Date.now()),
    file: generalFields.file.required()


}).required()



export const UpdateCoupon = joi.object({
    couponId: generalFields.id,
    amount: joi.number().positive().min(1).max(100),
    name: joi.string().min(3).max(25),
    expireDate: joi.date().greater(Date.now()),
    file: generalFields.file
}).required()