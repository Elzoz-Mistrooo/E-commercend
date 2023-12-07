import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudinary from '../../../utils/cloudnairy.js'
import CategoryModel from '../../../../DB/model/Category.model.js'
import slugify from "slugify";


export const GetCategory = asyncHandler(async (req, res, next) => {
    const category = await CategoryModel.find()
    return res.json({ messagee: "Done", category })
})




export const CreateCategory = asyncHandler(async (req, res, next) => {
    const name = req.body.name.toLowerCase()
    if (await CategoryModel.findOne({ name })) {
        return next(new Error("There is same NAme,Duplicated ", { cause: 409 }))
    }
    const slug = slugify(name, '_')
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}` })

    const category = await CategoryModel.create({
        name,
        slug: slug,
        image: { secure_url, public_id },
        createdBy: req.user._id
    })
    return res.json({ message: "DONe", category })


})











export const UpdateCategory = asyncHandler(async (req, res, next) => {
    const { categoryId } = req.params
    const category = await CategoryModel.findById(categoryId)
    if (!category) {
        return next(new Error("in-vailed category id", { cause: 400 }))
    }
    if (req.body.name) {
        req.body.name == req.body.name.toLowerCase()
        if (category.name == req.body.name) {
            return next(new Error("sorry cannot updatee category with same name"))
        }
        if (await CategoryModel.findOne({ name: req.body.name })) {
            return next(new Error("Duplicated Please get new name"))
        }

    }

    category.name = req.body.name
    req.body.slug = slugify(req.body.name, '-')

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category/${categoryId}` })

        await cloudinary.uploader.destroy(category.image.public_id)
        req.body.image = { secure_url, public_id }
    }
    category.updatedBy = req.user._id
    await category.save()
    return res.json({ messaage: "done", category })
})




