import userModel from "../../../../DB/model/User.model.js";
import bcrypt from 'bcryptjs'
import { asyncHandler } from "../../../utils/errorHandling.js";
import {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} from 'http-status-codes';
import jwt from 'jsonwebtoken'
import sendEmail from "../../../utils/email.js"
import * as validators from '../validation.js'
import { customAlphabet, nanoid } from "nanoid";
const { OAuth2Client } = require('google-auth-library');


export const signup = asyncHandler(
    async (req, res, next) => {
        const { userName, email, password, firstName, lastName } = req.body;

        const checkUser = await userModel.findOne({ email: email.toLowerCase() })
        if (checkUser) {
            return next(new Error("Email Exist", { cause: StatusCodes.CONFLICT }))
        }
        const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUND))
        const user = await userModel.create({
            firstName,
            lastName, userName,
            email, password: hashPassword
        })
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.EMAIL_SIGNATURE, { expiresIn: 60 * 5 })
        const newConfirmEmailToken = jwt.sign({ id: user._id, email: user.email }, process.env.EMAIL_SIGNATURE, { expiresIn: 60 * 60 * 24 * 30 })

        const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
        const requestNewEmailLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${newConfirmEmailToken}`
        const html = `<!DOCTYPE html>
        <html>
        <head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
        <style type="text/css">
        body{background-color: #88BDBF;margin: 0px;}
        </style>
        <body style="margin:0px;"> 
        <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
        <tr>
        <td>
        <table border="0" width="100%">
        <tr>
        <td>
        <h1>
            <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
        </h1>
        </td>
        <td>
        <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td>
        <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
        <tr>
        <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
        <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
        </td>
        </tr>
        <tr>
        <td>
        <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
        </td>
        </tr>
        <tr>
        <td>
        <p style="padding:0px 100px;">
        </p>
        </td>
        </tr>
        <tr>
        <td>
        <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
        </td>
        </tr>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <tr>
        <td>
        <a href="${requestNewEmailLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">New Verify Email address</a>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        <tr>
        <td>
        <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
        <tr>
        <td>
        <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
        </td>
        </tr>
        <tr>
        <td>
        <div style="margin-top:20px;">
    
        <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
        
        <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
        </a>
        
        <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
        <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
        </a>
    
        </div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </body>
        </html>`
        await sendEmail({ to: email, subject: "Confirmation Email", html })
        return res.status(StatusCodes.CREATED).json({ message: "Done", user, status: getReasonPhrase(StatusCodes.CREATED) })
    }

)

export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.EMAIL_SIGNATURE);
    const user = await userModel.findByIdAndUpdate(decoded.id, { confirmEmail: true })
    return user ? res.redirect("http://localhost:4200/#/login")
        : res.send(`<a href="http://localhost:4200/#/signUp">Ops looks like u don't have account yet follow me to signup now. </a>`)
})

export const newConfirmEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.EMAIL_SIGNATURE);
    const user = await userModel.findById(decoded.id)
    if (!user) {
        return res.send(`<a href="http://localhost:4200/#/signUp">Ops looks like u don't have account yet follow me to signup now. </a>`)
    }
    if (user.confirmEmail) {
        return res.redirect("http://localhost:4200/#/login")
    }

    const newToken = jwt.sign({ id: user._id, email: user.email }, process.env.EMAIL_SIGNATURE, { expiresIn: 60 * 2 })

    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`
    const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">

    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
    
    <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
    </a>
    
    <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
    </a>

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`
    await sendEmail({ to: user.email, subject: "Confirmation Email", html })
    return res.send(`<p>Check your inbox now</p>`)

})

export const login = asyncHandler(
    async (req, res, next) => {

        const { email, password } = req.body;

        // email = "lkk"
        const user = await userModel.findOne({ email: email.toLowerCase() })
        if (!user) {
            return next(new Error("Email  Not Exist", { cause: 404 }))
        }

        const match = bcrypt.compareSync(password, user.password)
        if (!match) {
            return next(new Error("In-valid login data", { cause: 400 }))
        }
        const token = jwt.sign(
            { userName: user.userName, id: user._id, isLoggedIn: true },
            process.env.TOKEN_SIGNATURE,
            { expiresIn: 60 * 60 }
        )
        return res.status(200).json({ message: "Done", token })

    }
)




export const sendCode = asyncHandler(async (req, res, next) => {

    const { email } = req.body
    const nanoId = customAlphabet('123457896', 4)
    const forgetCode = nanoId()

    const user = await userModel.findOneAndUpdate({ email: email.toLowerCase() }, { forgetCode }, { new: true })
    if (!user) {
        return next(new Error("Invaild Account,shof anta rey7 feen"))
    }

    const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <a href="" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${forgetCode}</a>
    </td>
    </tr>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <tr>
    <td>
    

    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
    
    <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
    </a>
    
    <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
    </a>

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`

    if (await sendEmail({ to: email, subject: "ForgetPassword", html })) {
        return next(new Error("Email is rejected", { cause: 400 }))
    }
    return res.status(200).json({ mesage: "Done" })

})

export const forgetpassword = asyncHandler(async (req, res, next) => {

    const { email, password, forgetCode } = req.body

    const user = await userModel.findOne({ email: email.toLowerCase() })
    if (!user) {
        return next(new Error("You've to Register First,shof anta rey7 feen"))
    }

    if (user.forgetCode != forgetCode || !forgetCode) {
        return next(new Error("invaild -reset yourr code."))
    }

    user.password = bcrypt.hashSync(password, parseInt(4))
    user.forgetCode = null
    user.changePasswordTime = Date.now()

    await user.save()
    return res.json({ message: "Done" })

})

export const loginWithGmail = async (req, res, next) => {
    const client = new OAuth2Client()
    const { idToken } = req.body
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        })
        const payload = ticket.getPayload()
        return payload
    }
    const { email_verified, email, name } = await verify()
    if (!email_verified) {
        return next(new Error('invalid email', { cause: 400 }))
    }
    const user = await userModel.findOne({ email, provider: 'GOOGLE' })
    //login
    if (user) {
        const token = generateToken({
            payload: {
                email,
                _id: user._id,
                role: user.role,
            },
            signature: process.env.SIGN_IN_TOKEN_SECRET,
            expiresIn: '1h',
        })

        const userUpdated = await userModel.findOneAndUpdate(
            { email },
            {
                token,
                status: 'Online',
            },
            {
                new: true,
            },
        )
        return res.status(200).json({ messge: 'Login done', userUpdated, token })
    }

    // signUp
    const userObject = {
        userName: name,
        email,
        password: nanoid(6),
        provider: 'GOOGLE',
        isConfirmed: true,
        phoneNumber: ' ',
        role: 'User',
    }
    const newUser = await userModel.create(userObject)
    const token = generateToken({
        payload: {
            email: newUser.email,
            _id: newUser._id,
            role: newUser.role,
        },
        signature: process.env.SIGN_IN_TOKEN_SECRET,
        expiresIn: '1h',
    })
    newUser.token = token
    newUser.status = 'Online'
    await newUser.save()
    res.status(200).json({ message: 'Verified', newUser })
}
