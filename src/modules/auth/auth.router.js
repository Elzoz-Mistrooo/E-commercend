import { validation } from '../../middleware/validation.js';
import * as authController from './controller/auth.js'
import * as validators from './validation.js'


import { Router } from "express";
const router = Router();


router.post("/signup", validation(validators.signup), authController.signup)
router.get("/confirmEmail/:token", authController.confirmEmail)
router.get("/newConfirmEmail/:token", authController.newConfirmEmail)
router.post("/login", validation(validators.login), authController.login)
router.patch("/sendCode", validation(validators.sendCode), authController.sendCode)
router.patch("/forgetpassword", validation(validators.forgetpassword), authController.forgetpassword)
router.post('/loginWithGmail', authController.loginWithGmail)

export default router