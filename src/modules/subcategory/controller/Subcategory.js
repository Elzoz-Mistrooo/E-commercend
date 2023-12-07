import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudinary from '../../../utils/cloudnairy.js'
import subCategoryModel from '../../../../DB/model/Subcategory.model.js'
import CategoryModel from "../../../../DB/model/Category.model.js";
import slugify from "slugify";
import { nanoid } from "nanoid";

export const GetsubCategory = asyncHandler(async (req, res, next) => {
    const subcategory = await subCategoryModel.find()
    return res.json({ messagee: "Done", subcategory })
})




export const CreatesubCategory = asyncHandler(async (req, res, next) => {


    const { categoryId } = req.params
    if (!await CategoryModel.findById(categoryId)) {
        return next(new Error("There is no ID,Please Register"))

    }
    const name = req.body.name.toLowerCase()
    if (await CategoryModel.findOne({ name })) {
        return next(new Error(`Duplicated name Find Subcategory with new name ${name}`))

    }
    const customId = nanoid()
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category/${categoryId}/${customId}` })
    const createSub = await subCategoryModel.create({
        name,
        slug: slugify(name, '-'),
        image: { secure_url, public_id },
        createdBy: req.user._id,
        categoryId,
        customId
    })
    return res.json({ message: "Done", createSub })



})





export const UpdatesubCategory = asyncHandler(async (req, res, next) => {
    const { subcategoryId, categoryId } = req.params
    const subcategory = await subCategoryModel.findById({ _id: subcategoryId, categoryId })
    if (!subcategory) {
        return next(new Error("in-vailed subcategory id", { cause: 400 }))
    }
    if (req.body.name) {
        req.body.name == req.body.name.toLowerCase()
        if (subcategory.name == req.body.name) {
            return next(new Error("sorry cannot updatee subcategory with same name"))
        }
        if (await subCategoryModel.findOne({ name: req.body.name })) {
            return next(new Error("Duplicated Please get new name"))
        }

    }

    subcategory.name = req.body.name
    req.body.slug = slugify(req.body.name, '-')

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category/${categoryId}` })
        await cloudinary.uploader.destroy(subcategory.image.public_id)
        req.body.image = { secure_url, public_id }
    }
    subcategory.updatedBy = req.user._id
    await subcategory.save()
    return res.json({ messaage: "done", subcategory })
})
