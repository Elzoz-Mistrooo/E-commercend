import { asyncHandler } from "../../../utils/errorHandling.js";
import CouponModel from "../../../../DB/model/coupon.model.js";
import cloudinary from '../../../utils/cloudnairy.js'
import slugify from "slugify";


export const Getcoupon = asyncHandler(async (req, res, next) => {
    const coupon = await CouponModel.find()
    return res.json({ messagee: "Done", coupon })
})




export const CreateCoupon = asyncHandler(async (req, res, next) => {
    req.body.name = req.body.name.toLowerCase()
    if (await CouponModel.findOne({ name: req.body.name })) {
        return next(new Error("There is same NAme,Duplicated ", { cause: 409 }))
    }


    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/coupon/` })
        req.body.image = { secure_url, public_id }


    }
    req.body.createdBy = req.user._id
    req.body.expireDate = new Date(req.body.expireDate)
    const cooupon = await CouponModel.create(req.body)

    return res.json({ message: "Done", cooupon })

})










export const updateCoupon = asyncHandler(async (req, res, next) => {
    const { couponId } = req.params
    const coupon = await CouponModel.findById(couponId)
    if (!coupon) {
        return next(new Error("in-vailed category id", { cause: 400 }))
    }

    if (req.body.name) {
        req.body.name == req.body.name.toLowerCase()
        if (coupon.name == req.body.name) {
            return next(new Error("sorry cannot updatee category with same name"))
        }
        if (await CouponModel.findOne({ name: req.body.name })) {
            return next(new Error("Duplicated Please get new name"))
        }

    }

    coupon.name = req.body.name

    if (req.body.amount) {
        coupon.amount = req.body.amount;
    }
    if (req.body.expireDate) {
        coupon.expireDate = new Date(req.body.expireDate)
    }


    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/coupon/${couponId}` })
        if (coupon.image) {
            await cloudinary.uploader.destroy(coupon.image.public_id)

        }
        req.body.image = { secure_url, public_id }
    }

    req.body.expireDate = new Date(req.body.expireDate)

    const updatecoupon = await CouponModel.updateOne({ _id: couponId }, req.body)
    return res.json({ messaage: "done", updatecoupon })
})




