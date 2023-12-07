import multer from "multer";

export const allowedExtensions = {
    Image: ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'],
    Files: ['application/pdf', 'application/javascript'],
    Videos: ['video/mp4'],
}

export function Fileupload(customValidation = []) {


    const storage = multer.diskStorage({})
    const fileFilter = function (req, file, cb) {

        if (customValidation.includes(file.mimetype)) {
            return cb(null, true)
        }
        cb(new Error('invalid extension', { cause: 400 }), false)
    }
    const upload = multer({ fileFilter, storage })
    return upload


}