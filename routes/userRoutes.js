const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(userController.getAllUsers);
router.route('/resetPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router.route('/login').post(authController.login);
// router.route('/logout').post(authController.logout);
router
  .route('/signup')
  .post(
    authController.checkEmail,
    authController.setAdmin,
    authController.signUp
  );
module.exports = router;
