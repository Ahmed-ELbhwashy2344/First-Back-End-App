import { AppError } from "../../utils/appError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { cartModel } from "../../../database/models/cart.model.js";
import { productModel } from "../../../database/models/products.model.js";
import { orderModel } from "../../../database/models/order.model.js";
import Stripe from "stripe";
import { userModel } from "../../../database/models/user.model.js";
import { response } from "express";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCashOrder = catchAsyncError(async (req, res, next) => {
  const cart = await cartModel.findById(req.params.id);
  if (!cart) return next(new AppError("cart not found", 404));
  const totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  const order = new orderModel({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });
  await order.save();
  if (order) {
    let options = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));
    await productModel.bulkWrite(options);
    await cartModel.findByIdAndDelete(req.params.id);
    return res.json({ message: "success", order });
  } else {
    return next(new AppError("cart not exist", 404));
  }
});
export const getSpecificOrder = catchAsyncError(async (req, res, next) => {
  let order = await orderModel
    .findOne({ user: req.user._id })
    .populate("cartItems.product");
  res.json({ message: "success", order });
});
export const getAllOrders = catchAsyncError(async (req, res, next) => {
  let orders = await orderModel.find({}).populate("cartItems.product");
  res.json({ message: "success", orders });
});
export const createCheckoutSession = catchAsyncError(async (req, res, next) => {
  const cart = await cartModel.findById(req.params.id);
  if (!cart) return next(new AppError("Cart not found", 404));
  const totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  let session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://route-comm.netlify.app/#/",
    cancel_url: "https://route-comm.netlify.app/#/cart",
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    metadata: req.body.shippingAddress,
  });
  res.json({ message: "success", session });
});
export const createOnlineOrder = catchAsyncError(async (req, res, next) => {
  const sig = req.headers["stripe-signature"].toString();
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      "whsec_BEllTSaIjWSZh6LLic2KaXnlysNS6d6g" // الـ Secret بتاعك
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    // 1. تعريف الـ session بشكل صحيح
    const session = event.data.object; 

    const cart = await cartModel.findById(session.client_reference_id);
    if (!cart) return next(new AppError("cart not found", 404));

    // 2. استخدام session.customer_email بدل e.customer_email
    let user = await userModel.findOne({ email: session.customer_email });
    if (!user) return next(new AppError("user not found", 404));

    const order = new orderModel({
      user: user._id,
      cartItems: cart.cartItems,
      totalOrderPrice: session.amount_total / 100, // استخدام session بدل e
      shippingAddress: session.metadata.address, // تأكد إنك باعت الـ metadata صح من الـ Checkout
      paymentType: "card",
      isPaid: true,
      paidAt: Date.now(),
    });

    await order.save();

    if (order) {
      let options = cart.cartItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
        },
      }));
      await productModel.bulkWrite(options);
      
      // مسح الـ Cart بتاع المستخدم بعد الدفع
      await cartModel.findByIdAndDelete(cart._id);
      
      return res.status(201).json({ message: "success", order });
    }
  }

  res.json({ received: true });
});
