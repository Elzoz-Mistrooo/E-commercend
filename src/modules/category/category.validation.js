
import joi from "joi";
import { generalFields } from "../../middleware/validation.js";




export const CreateCategory = joi.object({
    name: joi.string().min(3).max(25).required(),
    file: generalFields.file.required()
}).required()



export const UpdateCategory = joi.object({
    name: joi.string().min(3).max(25),
    file: generalFields.file
}).required()