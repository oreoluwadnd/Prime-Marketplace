const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/signup')
  .post(
    authController.checkEmail,
    authController.setAdmin,
    authController.signUp
  );
router.route('/login').post(authController.login);
router.route('/resetPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

router.use(authController.protect);
router.route('/me').get(userController.getMe);
router.route('/updateMe').patch(userController.updateMe);
router.route('/updatePassword').patch(authController.updatePassword);
router
  .route('/')
  .get(authController.restrictTo('admin'), userController.getAllUsers)
  .post(authController.restrictTo('admin'), userController.createUser);
router
  .route('/:id')
  .get(authController.restrictTo('admin'), userController.getUser)
  .patch(authController.restrictTo('admin'), userController.updateUser)
  .delete(authController.restrictTo('admin'), userController.deleteUser);

// router.route('/logout').post(authController.logout);

module.exports = router;
