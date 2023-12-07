
import joi from 'joi'


const reqMethods = ['body', 'query', 'params', 'headers', 'file', 'files']

const validationObjectId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message('invalid objectId')

}
export const generalFields =  {

    email: joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ['com', 'net',] }
    }).required(),
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    cPassword: joi.string().required(),
      id: joi.string().custom(validationObjectId).required(),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required()

    })
}


export const validation = (schema) => {
  return (req, res, next) => {
    // req
    const validationErrorArr = []
    for (const key of reqMethods) {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        }) // error
        if (validationResult.error) {
          validationErrorArr.push(validationResult.error.details)
        }
      }
    }

 


    

    if (validationErrorArr.length) {
      return res
        .status(400)
        .json({ message: 'Validation Error', Errors: validationErrorArr })
    }
    next()
  }
}


// export const validation=(schema)=>{
//   return(req,res,next)=>{
    
//     const inputCodes={...req.body ,...req.headers ,...req.params}
//     if (req.file || req.files) {
//       inputCodes.file= req.file|| req.files

//       const ValidationResult=schema.validate(inputCodes,{abortEarly:false})
//       if (ValidationResult.error) {
//         // return next(new Error("There is Herre"))
//         return res.json({mesgerror:"Validation Error",vallidationErr: ValidationResult.error.detalis})
//       }
//     }
    //return next()
//   }
// }