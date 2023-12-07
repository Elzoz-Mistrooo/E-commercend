import mongoose, { Schema, model, Types } from "mongoose";


const orderSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', require: true },
    address: String,
    phone: [{ type: String, required: true }],
    updatedBy: { type: Types.ObjectId, ref: "User" }
    ,
    products: [{
        name: { type: String, require: true },
        unitPrice: { type: Number, default: 1, required: true },
        finalPrice: { type: Number, default: 1, required: true },
        productId: { type: Types.ObjectId, ref: 'Product', require: true },
        quantity: { type: Number, default: 1, require: true },

    }],

    /////////////////////// 

    couponId: { type: Types.ObjectId, ref: 'Coupon', },
    finalPrice: { type: Number, default: 1, required: true },
    subTotal: { type: Number, default: 1, required: true },
    paymentType: {
        type: String,
        default: 'cash',
        enum: ['card', 'cash']
    },
    ///////////////////////////////
    status: {
        type: String,
        default: 'placed',
        enum: ['waitPayment', 'placed', 'canceled', 'rejected', 'onWay', 'delievred']

    },
    note: String,
    reason: String,



}, {

    timestamps: true
})




const orderModel = mongoose.models.order || model("Order", orderSchema)
export default orderModel