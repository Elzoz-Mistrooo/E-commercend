import mongoose, { Schema, model, Types } from "mongoose";


const productSchema = new Schema({
    customId: String,
    slug: { type: String, required: true, trim: true, lowercase: true },
    description: String,

    name: { type: String, required: true, trim: true, lowercase: true },
    stock: { type: Number, default: 1 },
    price: { type: Number, default: 1 },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 1 },
    colors: [String],
    size: {
        type: [String],
        enum: ['Small', 'M', 'L']
    },

    mainImage: { type: Object, require: true },
    subImages: { type: [Object] },


    createdBy: { type: Types.ObjectId, ref: 'User', requried: false },
    updatedBy: { type: Types.ObjectId, ref: 'User', requried: false },

    categoryId: { type: Types.ObjectId, ref: 'Category', require: true },
    subcategoryId: { type: Types.ObjectId, ref: 'Subcategory', require: true },
    brandId: { type: Types.ObjectId, ref: 'Brand', require: true },


    wishUserlist: { type: Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
}, {

    toJSON: { virtuals: true },
    toObject: { virtuals: true },


    timestamps: true

})

productSchema.virtual('review', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'productId'
})




const productModel = mongoose.models.product || model("product", productSchema)
export default productModel