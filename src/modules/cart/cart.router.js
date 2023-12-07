import { author } from '../../middleware/auntication.js';
import { endpoint } from './cart.endPoint.js';
import *as Cartcontroller from './controller/cart.js'
import { Router } from "express";
const router = Router()



router.post("/", author(endpoint.create), Cartcontroller.createCart)






export default router