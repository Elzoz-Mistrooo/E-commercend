import slugify from "slugify";
import brandModel from '../../../../DB/model/Brand.model.js'
import SubcategoryModel from "../../../../DB/model/Subcategory.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudnairy from '../../../utils/cloudnairy.js'
import { nanoid } from "nanoid";
import productModel from "../../../../DB/model/product.model.js";
import userModel from "../../../../DB/model/User.model.js";
import ApiFeatures from "../../../utils/apiFeatures.js";



export const ProductList = asyncHandler(async (req, res, next) => {
    const product = await productModel.find().populate([
        {
            path: 'review'
        }
    ])
    const apiFeatures = new ApiFeatures(productModel.find().populate([
        {
            path: 'review'
        }

    ]), req.query).paginate().filter().sort().select().search()

    const products = await apiFeatures.mongooseQuery;

    for (let i = 0; i < products.length; i++) {
        let calcualte = 0
        for (let j = 0; j < products[i].review.length; j++) {
            calcualte += products[i].review[j].rating

        }

        let avgRating = calcualte / products[i].review.length
        const product = products[i].toObject()
        product.avgRating = avgRating
        products[i] = product

    }

    return res.json({ message: "Done", products })

})



export const createProduct = asyncHandler(async (req, res, next) => {

    const { name, price, discount, categoryId, subcategoryId, brandId } = req.body
    // check Id 
    if (!await SubcategoryModel.findOne({ _id: subcategoryId, categoryId })) {
        return next(new Error("Please You've Wrong product Create,CHECK subcategoryId,categoryId"))

    }
    // check Id 

    if (!await brandModel.findOne({ _id: brandId })) {
        return next(new Error("Someting wrong BrandId"))

    }
    //2nd hn3ml name
    req.body.slug = slugify(name, {
        replacement: '_',
        trim: true,
        lower: true
    })
    //3rdd nd5l b2a price

    req.body.finalprice = price - (price * (discount || 0) / 100)

    const customId = nanoid()
    const { secure_url, public_id } = await cloudnairy.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.APP_NAME}/product/${customId}` })
    req.body.mainImage = { secure_url, public_id }

    if (req.body.subImages) {
        req.body.subImages = []
        for (const file of subImages) {
            const { secure_url, public_id } = await cloudnairy.uploader.upload(file.path, { folder: `${process.env.APP}/product/${customId}` })
            req.body.subImages.push({ secure_url, public_id })
        }
    }

    const product = await productModel.create(req.body)
    if (!product) {
        return next(new Error("Hello it's wrong for making produc"))
    }
    return res.json({ meessage: "Done", product })


})





export const updateProduct = asyncHandler(async (req, res, next) => {
    const { productId } = req.params
    const product = await productModel.findById(productId)
    if (!product) {
        return next(new Error("Pleaase you've to check if there is product for updating."))
    }

    const { name, price, discount, categoryId, subcategoryId, brandId } = req.body

    if (categoryId && subcategoryId) {
        if (!await SubcategoryModel.findOne({ _id: subcategoryId, categoryId })) {
            return next(new Error("Please You've Wrong product Create,CHECK subcategoryId,categoryId"))

        }
    }


    if (brandId) {
        if (!await brandModel.findOne({ _id: brandId })) {
            return next(new Error("Someting wrong BrandId"))

        }

    }
    //2nd hn3ml name
    if (name) {
        req.body.slug = slugify(name, {
            replacement: '_',
            trim: true,
            lower: true
        })
    }
    //3rdd nd5l b2a price
    if (price && discount) {
        req.body.finalprice = price - (price * (discount || 0) / 100)

    } else if (price) {
        req.body.finalprice = price - (price * (product.discount) / 100)

    } else if (discount) {
        req.body.finalprice = product.price - (product.price * (discount) / 100)

    }


    if (req.files?.mainImage?.length) {
        const { secure_url, public_id } = await cloudnairy.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.APP}/product/${customId}` })
        req.body.mainImage = { secure_url, public_id }
    }


    if (req.files?.subImages?.length) {
        if (req.body.subImages) {
            req.body.subImages = []
            for (const file of subImages) {
                const { secure_url, public_id } = await cloudnairy.uploader.upload(file.pah, { folder: `${process.env.APP}/product/${customId}` })
                req.body.subImages.push({ secure_url, public_id })
            }
        }
    }


    req.body.updatedBy = req.user._id
    await productModel.updateOne({ _id: product._id }, req.body)
    return res.json({ message: "Done" })

})


export const wishlist = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    if (!await productModel.findById(req.params.productId)) {
        return next(new Error("Hello,in-vailed Product."))
    }

    await userModel.updateOne({ _id: req.user._id }, { $addToSet: { wishlist: req.params.productId } })

    return res.status(200).json({ message: "Done" })
})

export const deleteFromWishlist = asyncHandler(async (req, res, next) => {

    await userModel.updateOne({ _id: req.user._id }, { $pull: { wishlist: req.params.productId } })
    return res.status(200).json({ message: "Done" })
})