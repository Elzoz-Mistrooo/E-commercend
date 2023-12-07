import cartModel from "../../../../DB/model/cart.model.js";
import CouponModel from "../../../../DB/model/Coupon.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import productModel from "../../../../DB/model/product.model.js";
import orderModel from "../../../../DB/model/order.model.js";
import Stripe from "stripe";
import payment from "../../../utils/paymentType.js";


export const createOrder = asyncHandler(async (req, res, next) => {
    //cart no7t feha 7ga
    const { note, address, phone, paymentType, couponName } = req.body

    if (!req.body.products) {
        const cart = await cartModel.findOne({ userId: req.user._id })
        //hna by3ml find lal user ely gy byshof kan 3aml a2bl kda wla l2

        if (!cart?.products?.length) {
            return next(new Error("Empty Carrt"))
        }
        req.body.isCart = true
        req.body.products = cart.products
    }

    //coupon ely hyd5ol m3 order
    if (couponName) {

        const coupon = await CouponModel.findOne({ name: couponName.toLowerCase(), usedBy: { $nin: req.user._id } })
        if (!coupon || coupon.expireDate.getTime() < Date.now()) {
            return next(new Error("Expired Coupon,NOt fount this Coupon Id"))
        }

        req.body.coupon = coupon
    }

    const productIds = [];
    const finalProductlist = [];
    let subTotal = 0;

    for (let product of req.body.products) {

        const checkproduct = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.quantity },
            isDeleted: false
        })

        if (!checkproduct) {
            return next(new Error(`You've someting Error during check ${product.productId} you've to check a right productiD`))
        }
        if (req.body.isCart) {
            product = product.toObject()
        }


        productIds.push(product.productId)
        product.name = checkproduct.name
        product.unitPrice = checkproduct.finalPrice
        product.finalPrice = product.quantity * checkproduct.finalPrice.toFixed(2)
        finalProductlist.push(product)
        subTotal += product.finalPrice




    }
    const order = await orderModel.create({
        phone,
        address,
        note,
        userId: req.user._id,
        couponId: req.body.coupon?._id,
        products: finalProductlist,
        subTotal,
        finalPrice: subTotal - (subTotal * ((req.body.coupon?.amount || 0) / 100)).toFixed(2),
        paymentType,
        status: paymentType == "card" ? "waitPayment" : "placed"

    })

    //n3ml decrease lal product fel cart
    for (const product of req.body.products) {
        await productModel.updateOne(
            { _id: product.productId },
            { $inc: { stock: -parseInt(product.quantity) } }

        )
    }

    //  fkra lma nd5ol coupon tany 1st nd5ol el wa nd55l el coupn ely d5lho user

    if (req.body.coupon) {
        await CouponModel.updateOne(
            { _id: req.body.coupon._id },
            { $push: { usedBy: req.user._id } }
        )
    }

    if (req.body.isCart) {
        await cartModel.updateOne(
            { userId: req.user._id }, { products: [] }
        )


    }
    else {
        await cartModel.updateOne({ userId: req.user.id }, {
            $pull: {
                products: {
                    productId: { $in: productIds }
                }
            }
        })
    }
    if (order.paymentType == 'card') {
        const stripe = new Stripe(process.env.STRIPE_KEY)
        if (req.body.coupon) {
            const coupon = await stripe.copuon.create({
                percent_off: req.body.coupon.amound, duration: 'once'
            })
            req.body.copuonId = coupon.id

        }
        const session = await payment({
            stripe, payment_method_types: ['card'],
            mode: 'payment',
            customer_email: req.user.email,
            metadata: {
                orderId: order.id.toString()
            },
            cancel_url: `${process.env.CANCEL_URL}?orderId=${order._id.toString()}`,
            line_items: order.products.map(product => {
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: product.name
                        },
                        unit_amount: product.unitPrice * 100

                    },
                    quantity: product.quantity
                }
            }),
            discounts: req.body.copuonId ? [{ copuon: req.body.copuonId }] : []

        })
        return res.status.json({ message: "Done,", order, session, url: session.url })
    }
    return res.json({ message: "Done", order })

})




export const cancelproduct = asyncHandler(async (req, res, next) => {
    //lazm nd5l order men params amal h3rf azay 
    //lazm yb2 fe reason 3shn n2wol el product da m3fn
    const { orderId } = req.params
    const { reason } = req.body
    const order = await orderModel.findOne({
        _id: orderId, userId: req.user._id
    })

    //check order id b3d kda ngyb user asln userId:req.user._id
    if (!order) {
        return next(new Error("Hello BROTHER NO ORDER OKAY", { cause: 404 }))
    }
    //check 3la order lwo god

    if ((order?.status != 'placed' && order.paymentType == 'delievered') || (order?.status != 'waitPayment' && order.paymentType == 'card')) {
        return next(new Error("We can not cancel your order cuz your order has been ( delievered || waitPayment)", { cause: 404 }))

    }

    //hn3ml lal cancel order
    //1         _id:orderId,
    // {status جوا ده هنعمل كذا حاجة}(
    const CancelOrder = await updateOne(
        { _id: orderId },
        { status: "canceled Order", reason, updatedBy: req.user._id }

    )

    if (!CancelOrder.matchCount) {
        return next(new Error("Hello We didn't Cancel order,There is something wrong,please check"))
    }

    for (const product of order.products) {
        {
            await productModel.updateOne({ _id: product.productId }, {
                $inc: {
                    stock: parseInt(product.quantity)
                }
            })
        }
    }


    //hn3ml for loob product of order.products 3ady 3shn nshof el 7gat ely httms7
    // leh order.product 3shn a27na bnrwo7 schema bt3t order ely feha prroducts(products: [{
    //     name: { type: String, require: true },
    //     unitPrice: { type: Number, default: 1, required: true },
    //     finalPrice: { type: Number, default: 1, required: true },
    //     productId: { type: Types.ObjectId, ref: 'Product', require: true },
    //     quantity: { type: Number, default: 1, require: true },

    // }],)
    //bn3ml 3lyha for loob 3shn ngyb el el 7ga ely httms7

    if (order.couponId) {
        await CouponModel.updateOne(
            { _id: couponId },
            { $pull: { usedBy: req.user._id } }
        )
    }

    return res.status(200).json({ message: "Done Making cancel order" })
})

export const UpdateOrderByAdmin = asyncHandler(async (req, res, next) => {

    const { orderId } = req.params;
    const { status } = req.body;
    const order = await orderModel.findOne({ _id: orderId })
    if (!order) {
        return next(new Error("Hello There is not order to update By admin "))
    }
    const updateOrder = await orderModel.updateOne(
        { _id: orderId._id }, { status, updatedBy: req.user._id }
    )
    // lazm fel _id   _id: orderId._id,) lazm orderId._id amal hgyb bt3 meen
    if (!updateOrder) {
        return next(new Error("Hello Admin Failed to update Order", { cause: 400 }))
    }
    return res.status(200).json({ message: "Updated By admin Order" })


})














export const webHook = asyncHandler(async (req, res, next) => {
    const stripe = new Stripe(process.env.Secret_key);

    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.endpointSecret);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    const { orderId } = event.data.object.metadata
    if (event.type != 'checkout.session.completed') {
        await orderModel.updateOne({ _id: orderId }, { status: "rejected" })
        return res.status(400).json({ message: "Rejected payment" })
    }
    await orderModel.updateOne({ _id: orderId }, { status: "placed" })
    return res.status(200).json({ message: "Done" })

})