/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createOrder = catchAsync(async (req, res, next) => {
  const { cartItems, shippingAddress, shippingCost, shippingMethod } = req.body;
  if (!cartItems || cartItems.length === 0) {
    return next(new AppError('Cart is empty', 400));
  }
  if (!shippingAddress) {
    return next(new AppError('Shipping address is required', 400));
  }
  let orderItems = [];
  let subTotal = 0;

  for (const item of cartItems) {
    const unitProduct = await Product.findById(item.productId);
    if (!unitProduct) {
      return next(
        new AppError(`Product not found with ${item.productId}`, 404)
      );
    }
    const SingleItemSchema = {
      product: item.productId,
      name: unitProduct.name,
      price: unitProduct.price,
      quantity: item.quantity,
      imageCover: unitProduct.imageCover,
    };
    orderItems = [...orderItems, SingleItemSchema];
    subTotal += unitProduct.price * item.quantity;
  }
  const totalPrice = subTotal + shippingCost;
  //pAYMENT api integration here later on ...
  const newOrder = await Order.create({
    user: req.user._id,
    oderItems: orderItems,
    totalPrice,
    subTotal,
    shippingAddress,
    shippingMethod,
    paymentMethod: 'cash on delivery',
    paymentToken: 'neworder',
    paymentId: 'neworder',
  });
});
