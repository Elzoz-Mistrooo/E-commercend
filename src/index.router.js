import connectDB from '../DB/connection.js'
import userRouter from './modules/user/user.router.js'
import authRouter from './modules/auth/auth.router.js'
import branRouter from './modules/brand/brand.router.js'
import cartRouter from './modules/cart/cart.router.js'
import categoryRouter from './modules/category/category.router.js'
import couponRouter from './modules/coupon/coupon.router.js'
import orderRouter from './modules/order/order.router.js'
import productRouter from './modules/product/product.router.js'
import reviewsRouter from './modules/reviews/reviews.router.js'
import subcategoryRouter from './modules/subcategory/subcategory.router.js'
import { globalErrorHandling } from './utils/errorHandling.js'
import morgan from 'morgan'
import cors from 'cors'

const bootstrap = (app, express) => {
    app.use(cors()) // allow access from anywhere
    app.use((req, res, next) => {
        if (req.originalUrl === '/order/webhook') {
            next()
        } else {
            express.json({})(req, res, next)
        }
    })

    var whitelist = ['http://127.0.0.1:5500', 'http://example2.com']

    if (process.env.MOOD == "DEV") {
        app.use(morgan("dev"))
    } else {
        app.use(morgan("combined"))
    }



    app.use(express.json())
    app.use("/auth", authRouter)
    app.use("/user", userRouter)
    app.use(`/product`, productRouter)
    app.use(`/category`, categoryRouter)
    app.use(`/subcategory`, subcategoryRouter)
    app.use(`/reviews`, reviewsRouter)
    app.use(`/coupon`, couponRouter)
    app.use(`/cart`, cartRouter)
    app.use(`/order`, orderRouter)
    app.use(`/brand`, branRouter)
    app.use("*", (req, res, next) => {
        return res.json({ message: "In-valid Routing" })
    })

    app.use(globalErrorHandling)
    connectDB()
}

export default bootstrap