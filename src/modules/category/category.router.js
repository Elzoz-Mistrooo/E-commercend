import subcategory from '../subcategory/subcategory.router.js'
import *as CategoryContolle from './controller/category.js'
import *as validators from './category.validation.js'
import { Fileupload, allowedExtensions } from '../../utils/multer.cloud.js';
import { validation } from "../../middleware/validation.js";
import { author, roles } from '../../middleware/auntication.js';
import { Router } from "express";
import { endPoint } from './category.endpoint.js';
const router = Router()

router.use("/:categoryId/subcategory", subcategory)


router.post("/", author(endPoint.create), Fileupload(allowedExtensions.Image).single('image'),
    validation(validators.CreateCategory), CategoryContolle.CreateCategory

)

router.put("/:categoryId", author(endPoint.update),
    Fileupload(allowedExtensions.Image).single('image'),
    validation(validators.UpdateCategory),
    CategoryContolle.UpdateCategory

)

router.get("/", author(Object.values(roles)),
    CategoryContolle.GetCategory

)


export default router