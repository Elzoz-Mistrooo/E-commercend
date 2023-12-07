import *as orderController from './controller/order.js'
import * as validators from './order.validation.js'
import { validation } from '../../middleware/validation.js';
import { Router } from "express";
import { author } from '../../middleware/auntication.js';
import { endpoint } from './order.endPoint.js';
const router = Router()




router.post("/", author(endpoint.create), validation(validators.createOrder), orderController.createOrder)
router.patch("/:orderId", author(endpoint.CancelOrder), validation(validators.CancelOrder), orderController.createOrder)
router.patch("/:orderId/Admin", author(endpoint.UpdateOrder), validation(validators.UpdateOrder), orderController.UpdateOrderByAdmin)


export default router