import multer from "multer";
import path from 'path'
import fs from 'fs'
import { nanoid } from "nanoid";

export const allowedExtensions = {
    Images: ['image/png', 'image/jpeg'],
    Videos: ['video/mp4'],
    Files: ['application/javascript'],
}


export function MulterValidation(customMulter, customPath) {
    if (!customMulter) {
        customMulter = allowedExtensions.Images
    }

    const destPath = path.resolve(`uploads/${customPath}`)
    if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true })
    }

    if (!customPath) {
        customPath = "General"
    }



    const storage = multer.diskStorage({
        destination: function (req, file, cb) {


            cb(null, destPath)

        },
        filename: function (req, file, cb) {

            const unquiePathName = nanoid() + file.originalname
            cb(null, unquiePathName)

        }




    })
    const filterFile = (req, file, cb) => {
        if (customMulter.include(file.mimetype)) {
            return cb(null, true)
        }
        cb(next(new Error("Invailed Routing File Filter", { cause: 400 })))
    }
    const upload = multer({ filterFile, storage })
    return upload

}