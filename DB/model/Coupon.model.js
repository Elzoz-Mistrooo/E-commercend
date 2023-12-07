import { Schema, model, Types } from "mongoose";


const CouponSchema = new Schema({
    name: { type: String, require: true, lowercase: true, unique: true },
    image: { type: Object },
    expireDate: { type: Date, require: true },
    usedBy: [{ type: Types.ObjectId, ref: 'User' }],
    amount: { type: Number, default: 1 },
    updatedBy: { type: Types.ObjectId, ref: 'User', requried: false },
    createdBy: { type: Types.ObjectId, ref: 'User', requried: false },



}, {

    timestamps: true
})




const CouponModel = model("Coupon", CouponSchema)
export default CouponModel