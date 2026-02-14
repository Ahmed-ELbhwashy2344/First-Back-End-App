import { AppError } from "../../utils/appError.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { APIFeatures } from "../../utils/APIFeatures.js";
import { cartModel } from "../../../database/models/cart.model.js";
import { productModel } from "../../../database/models/products.model.js";
import { couponModel } from "../../../database/models/coupoun.model.js";

function calcTotalPrice(cart) {
  let total = 0;
  cart.cartItems.forEach((item) => {
    total += item.quantity * item.price;
  });
  cart.totalPrice = total;
  if (cart.discount) {
    cart.totalPriceAfterDiscount = total - (total * cart.discount) / 100;
  } else {
    cart.totalPriceAfterDiscount = total;
  }
}
export const addProductToCart = catchAsyncError(async (req, res, next) => {
  let product = await productModel.findById(req.body.product);
  if (!product) return next(new AppError("product not found", 401));
  req.body.price = product.price;
  let isCartExist = await cartModel.findOne({ user: req.user._id });
  if (!isCartExist) {
    let result = new cartModel({
      user: req.user._id,
      cartItems: [req.body],
    });
    calcTotalPrice(result);
    await result.save();
    res.json({ message: "success", result });
  }
  let item = isCartExist.cartItems.find(
    (elm) => elm.product == req.body.product,
  );
  if (item) {
    item.quantity += 1;
  } else {
    isCartExist.cartItems.push(req.body);
  }
  calcTotalPrice(isCartExist);
  await isCartExist.save();
  res.json({ message: "success", cart: isCartExist });
});
// export const removeProductFromCart = catchAsyncError(async (req, res, next) => {
//   let result = await cartModel.findOneAndUpdate(
//     { user: req.user._id },
//     { $pull: { cartItems: { _id: req.params.id } } },
//     { new: true },
//   );
//   if (result) return res.json({ message: "success", result });
//   next(new AppError("item not found", 500));
// });
export const removeProductFromCart = catchAsyncError(async (req, res, next) => {
  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) return next(new AppError("cart not found", 404));
  cart.cartItems = cart.cartItems.filter(
    (item) => item._id.toString() !== req.params.id,
  );
  calcTotalPrice(cart);
  await cart.save();
  res.json({ message: "success", cart });
});
export const updateQuantity = catchAsyncError(async (req, res, next) => {
  let product = await productModel.findById(req.params.id);
  if (!product) return next(new AppError("product not found", 401));
  let isCartExist = await cartModel.findOne({ user: req.user._id });
  if (!isCartExist) return next(new AppError("Cart not found", 404));
  let item = isCartExist.cartItems.find(
    (elm) => elm.product.toString() == req.params.id,
  );

  if (item) {
    item.quantity = req.body.quantity;
  } else {
    return next(new AppError("Item not found in cart", 404));
  }
  calcTotalPrice(isCartExist);
  await isCartExist.save();
  res.json({ message: "success", cart: isCartExist });
});
// export const applyCoupon = catchAsyncError(async (req, res, next) => {
//   let coupon = await couponModel.findOne({
//     code: req.body.code,
//     expires: { $gt: Date.now() },
//   });
//   if (!coupon) return next(new AppError("Invalid or expired coupon", 404));
//   let cart = await cartModel.findOne({ user: req.user._id });
//   if (!cart) return next(new AppError("Cart not found", 404));
//   cart.totalPriceAfterDiscount =
//     cart.totalPrice - (cart.totalPrice * coupon.discount) / 100;
//   await cart.save();
//   res.json({ message: "success", cart });
// });
export const applyCoupon = catchAsyncError(async (req, res, next) => {
  let coupon = await couponModel.findOne({
    code: req.body.code,
    expires: { $gt: Date.now() },
  });
  if (!coupon) return next(new AppError("Invalid or expired coupon", 404));
  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) return next(new AppError("Cart not found", 404));
  cart.discount = coupon.discount;
  calcTotalPrice(cart);
  await cart.save();
  res.json({ message: "success", cart });
});
export const getLoggedUserCart = catchAsyncError(async (req, res, next) => {
  let cartItems = await cartModel.findOne({ user: req.user._id }).populate('cartItems.product', 'title')
  res.json({ message: "success",cart: cartItems});
});