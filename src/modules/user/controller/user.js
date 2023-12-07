import jwt from "jsonwebtoken";
import userModel from "../../../../DB/model/User.model.js"
import fs from 'fs'
import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/cloudnairy.js";

export const getUsers = asyncHandler(async (req, res) => {
    const { phone, age } = req.body
    const user = await userModel.findById(req.user._id)
    return res.json({ message: "Done", user })
})


export const profileImage = asyncHandler(async (req, res, next) => {

    const { _id } = req.headers
    const user = await userModel.findByIdAndUpdate(_id, { profileImage: req.file.path, }, { new: true },)

    return res.json({ message: "Done", file: req.file, user })
})


export const coverImages = asyncHandler(async (req, res, next) => {
    const { _id } = req.headers
    /////////////////////////////////////////////////
    if (!req.files) {
        return next(new Error('please ulpoad your picture', { cause: 400 }))
    }
    /////////////////////////////////////////////////////////
    const imagesArr = [];
    for (const file of req.files) {
        imagesArr.push(file.path)
    }

    const user = await userModel.findByIdAndUpdate(
        _id,
        {
            coverImages: imagesArr,
        },
        { new: true },
    )
    return res.status(200).json({ message: 'Done', user })
})

export const profileImageCloud = asyncHandler(async (req, res, next) => {
    const { _id } = req.headers
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `C40zezo/${req.user._id}` })
    const user = await userModel.findByIdAndUpdate(_id, { profileImage: { secure_url, public_id } }, { new: true })

    return res.json({ message: "Done", file: req.file, user })

})
export const coverImagesCloud = asyncHandler(async (req, res, next) => {
    const { _id } = req.headers
    const imagesArr = [];
    for (const file of req.files) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `C40zezoCloudCoverImage/${req.user._id}` })
        imagesArr.push({ secure_url, public_id })
    }

    const user = await userModel.findByIdAndUpdate(
        _id,
        {
            coverImages: imagesArr
        },
        { new: true },
    )
    return res.status(200).json({ message: 'Done', user, file: req.files })
})
export const removeCloud = asyncHandler(async (req, res, next) => {
    const { _id } = req.body
    const user = await userModel.findById(_id)

    if (user) {
        await cloudinary.uploader.destroy(public_id)
        // await cloudinary.api.delete_resources([publibIds])  // delete bulk of publicIds
        return next(new Error('please try again later', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', user })
})



export const attachmentYAgd3an = asyncHandler(async (req, res, next) => {

    const { _id } = req.headers
    const user = await userModel.findByIdAndUpdate(_id, { attachmentYAgd3an: req.file.path, }, { new: true },)

    return res.json({ message: "Done", file: req.file, user })
})
export const attachmentYAgd3anCloud = asyncHandler(async (req, res, next) => {


    const { _id } = req.headers
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `C40zezo/${req.user._id}` })
    const user = await userModel.findByIdAndUpdate(_id, { attachmentYAgd3anCloud: { secure_url, public_id } }, { new: true })



    return res.json({ message: "Done", file: req.file, user })
})
