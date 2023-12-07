import *as productController from './controller/product.js'
import *as validators from './product.validation.js'
import { Fileupload, allowedExtensions } from '../../utils/multer.cloud.js';
import { validation } from "../../middleware/validation.js";
import { author } from '../../middleware/auntication.js';
import { Router } from "express";
import { endPoint } from './product.endPoint.js';
import RevIewRouter from '../reviews/reviews.router.js'
const router = Router()

router.use("/:productId/review", RevIewRouter)

router.post("/",
    author(endPoint.create)
    , Fileupload(allowedExtensions.Image).fields([
        { name: "mainImage", maxCount: 1 },
        { name: "subImages", maxCount: 5 },
    ])
    , validation(validators.updateProduct), productController.createProduct)


router.put("/:productId",
    author(endPoint.update),
    Fileupload(allowedExtensions.Image).fields([
        { name: "mainImage", maxCount: 1 },
        { name: "subImages", maxCount: 5 },
    ]), validation(validators.updateProduct), productController.updateProduct)

router.patch("/:productId/wishlist/add",
    author(endPoint.wishlist), validation(validators.wishlist),
    productController.wishlist)

router.patch("/:productId/wishlist/remove",
    author(endPoint.wishlist),
    validation(validators.wishlist),
    productController.deleteFromWishlist)


export default router