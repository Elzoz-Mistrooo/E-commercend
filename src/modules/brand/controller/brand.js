import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudinary from '../../../utils/cloudnairy.js'
import brandModel from '../../../../DB/model/Brand.model.js'


export const GetBrand = asyncHandler(async (req, res, next) => {
    const brand = await brandModel.find()
    return res.json({ messagee: "Done", brand })
})




export const CreateBrand = asyncHandler(async (req, res, next) => {
    const name = req.body.name.toLowerCase()


    if (await brandModel.findOne({ name })) {
        return next(new Error(`There is Duplicated with this Name ${name}`))
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/brand` })
    const brand = await brandModel.create({
        name,
        image: { secure_url, public_id },
        updatedBy: req.user._id
    })
    return res.json({ message: "Done", brand })

})










export const UpdateBrand = asyncHandler(async (req, res, next) => {
    const { brandId } = req.params
    const brand = await brandModel.findById(brandId)
    if (!brand) {
        return next(new Error("in-vailed category id", { cause: 400 }))
    }
    if (req.body.name) {
        req.body.name == req.body.name.toLowerCase()
        if (brand.name == req.body.name) {
            return next(new Error("sorry cannot updatee category with same name"))
        }
        if (await brandModel.findOne({ name: req.body.name })) {
            return next(new Error("Duplicated Please get new name"))
        }

    }

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/brand/${brandId}` })
        await cloudinary.uploader.destroy(category.image.public_id)
        brand.image = { secure_url, public_id }

    }
    brand.updatedBy = req.user._id
    await brand.save()
    return res.json({ messaage: "done", brand })
})




