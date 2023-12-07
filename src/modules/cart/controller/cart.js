import cartModel from "../../../../DB/model/cart.model.js";
import productModel from "../../../../DB/model/product.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";





export const createCart = asyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body
    const product = await productModel.findById(productId)
    if (!product) {
        return next(new Error(`Wrong product ID ,please you''ve to check`, { cause: 400 }))
    }


    if (product.stock < quantity || product.isDeleted) {

        await productModel.updateOne({ _id: productId }, { $addToSet: { wishUserlist: req.user._id } })
        return next(new Error(`Limit of stock is near from Out of stock-maybe out of stock ${product.stock}`, { cause: 400 }))
    }

    const cart = await cartModel.findOne({ userId: req.user._id })
    if (!cart) {

        const newCart = await cartModel.create({
            userId: req.user._id,
            products: [{ productId, quantity }]
        })
        return res.status(201).json({ message: "Done", cart: newCart })
    }

    let matchProduct = false
    for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].productId.toString() == productId) {
            cart.products[i].quantity = quantity
            matchProduct = true
        }

    }
    if (!matchProduct) {
        cart.products.push({ productId, quantity })
    }
    await cart.save()
    return res.status(201).json({ message: "Done", cart })


})