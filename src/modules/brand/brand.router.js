import *as  BrandController from './controller/brand.js'
import *as validators from './brand.validation.js'
import { Fileupload, allowedExtensions } from '../../utils/multer.cloud.js';
import { validation } from "../../middleware/validation.js";
import { Router } from "express";
import { author } from '../../middleware/auntication.js';
import { endPoint } from './brandEndpoint.js';
const router = Router()




router.post("/", author(endPoint.create), Fileupload(allowedExtensions.Image).single('image'),
    validation(validators.CreateBrand),
    BrandController.CreateBrand

)

router.put("/:brandId",
    author(endPoint.update), Fileupload(allowedExtensions.Image).single('image'),
    validation(validators.UpdateBrand),
    BrandController.UpdateBrand

)

router.get("/",
    BrandController.GetBrand

)



export default router