import orderModel from "../../../../DB/model/order.model.js";
import reviewModel from "../../../../DB/model/Review.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";



export const createReview = asyncHandler(async (req, res, next) => {

    const { productId } = req.params;
    const { comment, rating } = req.body;

    const order = await orderModel.findOne({
        userId: req.user._id,
        "products.productId": productId,
        status: 'delivered'
    })
    if (!order) {
        return next(new Error('cannot review product before you get it.', { status: 400 }))
    }
    if (await reviewModel.findOne({ productId, createdBy: req.user._id })) {
        return next(new Error('cannot review the same product twice.', { status: 400 }))
    }

    await reviewModel.create({
        orderId: order._id,
        productId,
        createdBy: req.user._id,
        comment,
        rating
    })
    return res.status(201).json({ message: "Done" })
})


export const updateReview = asyncHandler(async (req, res, next) => {

    const { productId, reviewId } = req.params;
    await reviewModel.updateOne({ _id: reviewId, productId, createdBy: req.user._id }, req.body)
    return res.status(200).json({ message: "Done" })
})