const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.route('/').post(orderController.test, orderController.test2);

module.exports = router;
