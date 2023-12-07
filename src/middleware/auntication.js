import jwt from 'jsonwebtoken'
import userModel from '../../DB/model/User.model.js';
import { asyncHandler } from '../utils/errorHandling.js';

export const roles = {
    Admin: 'Admin',
    HR: 'HR',
    User: 'User'

}



export const author = (accessRoles = []) => {
    return asyncHandler(async (req, res, next) => {
        const { authorization } = req.headers;

        if (!authorization?.startsWith(process.env.TOKEN_BEARER)) {
            return next(new Error("authorization is required  or In-valid Bearer key", { cause: 400 }))
        }

        const token = authorization.split(process.env.TOKEN_BEARER)[1]
        if (!token) {
            return next(new Error("token is required ", { cause: 400 }))
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE);

        if (!decoded?.id) {
            return next(new Error("In-valid token payload", { cause: 400 }))
        }

        const user = await userModel.findById(decoded.id)

        if (parseInt(user.changePasswordTime?.getTime() / 1000) > decoded.iat) {
            return next(new Error("token is expired ", { cause: 400 }))

        }


        if (!user) {
            return next(new Error("Not register account", { cause: 401 }))
        }



        if (!accessRoles.includes(user.role)) {
            return next(new Error("Not authoriz for this page", { cause: 403 }))
        }


        req.user = user
        return next()
    })
}