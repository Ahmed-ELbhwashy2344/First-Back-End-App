import { AppError } from "../../utils/appError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { cartModel } from "../../../database/models/cart.model.js";
import { productModel } from "../../../database/models/products.model.js";
import { orderModel } from "../../../database/models/order.model.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCashOrder = catchAsyncError(async (req, res, next) => {
  const cart = await cartModel.findById(req.params.id);
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
