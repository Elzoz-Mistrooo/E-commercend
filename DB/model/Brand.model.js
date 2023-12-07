import mongoose, { Schema, model, Types } from "mongoose";


const brandSchema = new Schema({
    name: { type: String, require: true, lowercase: true },
    image: { type: Object, require: true },
    createdBy: { type: Types.ObjectId, ref: 'User', requried: false },
    updatedBy: { type: Types.ObjectId, ref: 'User', requried: false },



}, {

    timestamps: true
})




const brandModel = mongoose.models.Brand || model("Brand", brandSchema)
export default brandModel