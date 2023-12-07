import mongoose, { Schema, model, Types } from "mongoose";

const SubcategorySchema = new Schema({

    slug: { type: String, required: true, trim: true, unique: true },
    name: { type: String, require: true, lowercase: true },
    image: { type: Object, require: true },
    categoryId: { type: Types.ObjectId, ref: 'Category', required: true },
    customId: { type: String, require: true },
    createdBy: { type: Types.ObjectId, ref: 'User', requried: false },
    updatedBy: { type: Types.ObjectId, ref: 'User', requried: false },



}, {
    timestamps: true
})

const SubcategoryModel = mongoose.models.Subcategory || model("Subcategory", SubcategorySchema)
export default SubcategoryModel
