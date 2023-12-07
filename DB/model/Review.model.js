import mongoose, { Schema, model, Types } from "mongoose";


const ReviewSchema = new Schema({
    comment: { type: String, require: true },
    rate: { type: Number, required: true, min: 1, max: 5 },
    createdBy: { type: Types.ObjectId, ref: 'User', requried: false },
    productId: { type: Types.ObjectId, ref: "Product", required: true },
    orderId: { type: Types.ObjectId, ref: "Order", required: true }


}, {

    timestamps: true
})




const ReviewModel = mongoose.models.Review || model("Review", ReviewSchema)
export default ReviewModel