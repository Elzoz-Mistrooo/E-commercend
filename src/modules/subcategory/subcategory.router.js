import *as SubcategoryContolle from './controller/Subcategory.js'
import *as validators from './subcategory.validation.js'
import { Fileupload, allowedExtensions } from '../../utils/multer.cloud.js';
import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { author } from '../../middleware/auntication.js';
import { endPoint } from './subcategoryEndpoint.js';

const router = Router({ mergeParams: true })





router.post("/", author(endPoint.create), Fileupload(allowedExtensions.Image).single('image'),
    validation(validators.CreatesubCategory),
    SubcategoryContolle.CreatesubCategory

)

router.put("/:subcategoryId", author(endPoint.update), Fileupload(allowedExtensions.Image).single('image'),
    validation(validators.UpdatesubCategory),
    SubcategoryContolle.UpdatesubCategory

)

router.get("/",
    SubcategoryContolle.GetsubCategory

)





export default router