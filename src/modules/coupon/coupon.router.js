import *as CouponController from './controller/coupon.js'
import *as validators from './coupon.validation.js'
import { Fileupload, allowedExtensions } from '../../utils/multer.cloud.js';
import { validation } from "../../middleware/validation.js";
import { Router } from "express";
import { author } from '../../middleware/auntication.js';
import { endpoint } from './Coupon.endpoint.js';
const router = Router()




router.post("/", author(endpoint.create), Fileupload(allowedExtensions.Image).single('image'),
    validation(validators.CreateCoupon),
    CouponController.CreateCoupon

)

router.put("/:couponId", author(endpoint.update), Fileupload(allowedExtensions.Image).single('image'),
    validation(validators.UpdateCoupon),
    CouponController.updateCoupon

)

router.get("/",
    CouponController.Getcoupon

)



export default router