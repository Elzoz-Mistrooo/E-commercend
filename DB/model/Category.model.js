import { Schema, model, Types } from "mongoose";


const CategorySchema = new Schema({
    slug: { type: String, required: true },
    name: { type: String, require: true, lowercase: true },
    image: { type: Object, require: true },
    createdBy: { type: Types.ObjectId, ref: 'User', requried: false },
    updatedBy: { type: Types.ObjectId, ref: 'User', requried: false },



}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
})

CategorySchema.virtual('subcategory', {
    localField: '_id',
    foreignField: 'categoryId',
    ref: 'Subcategory'
})

const CategoryModel = model("Category", CategorySchema)
export default CategoryModel