/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createOrderItems = catchAsync(async (req, res, next) => {
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
  req.body.totalPrice = subTotal + shippingCost;
  req.body.orderItems = orderItems;
  req.body.subTotal = subTotal;
  req.body.shippingCost = shippingCost;
  next();
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const { oderItems, totalPrice, shippingAddress, subTotal, shippingMethod } =
    req.body;
  const newOrder = await Order.create({
    user: req.user._id,
    oderItems,
    totalPrice,
    subTotal,
    shippingAddress,
    shippingMethod,
    paymentMethod: 'cash on delivery',
    paymentToken: 'neworder',
    paymentId: 'neworder',
  });
});

exports.test = catchAsync(async (req, res, next) => {
  req.body.test = 'test';
  next();
});

exports.test2 = catchAsync(async (req, res, next) => {
  res.status(200).json({
    result: 'success',
    data: {
      data: req.body.test,
    },
  });
});
