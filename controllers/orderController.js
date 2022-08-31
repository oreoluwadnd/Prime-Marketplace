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
    const unitProduct = await Product.findById(item.id);
    if (!unitProduct) {
      return next(new AppError(`Product not found with ${item.id}`, 404));
    }
    const SingleItemSchema = {
      product: item.id,
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
  // req.cartItems = undefined;
  next();
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const { orderItems, totalPrice, shippingAddress, subTotal, shippingMethod } =
    req.body;
  const newOrder = await Order.create({
    user: req.user.id,
    orderItems,
    totalPrice,
    subTotal,
    shippingAddress: 'Abuja',
    shippingMethod: 'express',
    paymentMethod: 'cash on delivery',
    paymentToken: 'neworder',
    paymentId: 'neworder',
  });
  res.status(201).json({
    status: 'success',
    data: {
      order: newOrder,
    },
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find();
  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
    },
  });
});
exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });
  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
    },
  });
});

exports.getOrderbyUser = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.params.userId });
  res.status(200).json({
    status: 'success',
    results: orders.length,
    data: {
      orders,
    },
  });
});
