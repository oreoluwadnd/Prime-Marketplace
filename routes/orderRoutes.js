const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/myOrders', authController.protect, orderController.getMyOrders);

router.get(
  '/:userId',
  authController.protect,
  authController.restrictTo('admin'),
  orderController.getOrderbyUser
);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    orderController.getAllOrders
  )
  .post(
    authController.protect,
    orderController.createOrderItems,
    orderController.createOrder
  );
router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    orderController.getOrder
  );

module.exports = router;
