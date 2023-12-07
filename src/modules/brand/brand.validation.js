import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'





export const CreateBrand = joi.object({
    name: joi.string().min(3).max(25).required(),
    file: generalFields.file,


}).required()



export const UpdateBrand = joi.object({
    brandId: generalFields.id,
    name: joi.string().min(3).max(25),
    file: generalFields.file
}).required()