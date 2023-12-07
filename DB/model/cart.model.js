import mongoose, { Schema, model, Types } from "mongoose";


const cartSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', require: true, unique: true },
    products: [{
        productId: { type: Types.ObjectId, ref: 'Product', require: true },
        quantity: { type: Number, default: 1, require: true },

    }]


}, {

    timestamps: true
})




const cartModel = mongoose.models.cart || model("Cart", cartSchema)
export default cartModel