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
  .get(authController.retrictTo('admin'), userController.getAllUsers)
  .post(authController.retrictTo('admin'), userController.createUser);
router
  .route('/:id')
  .get(authController.retrictTo('admin'), userController.getUser)
  .patch(authController.retrictTo('admin'), userController.updateUser)
  .delete(authController.retrictTo('admin'), userController.deleteUser);

// router.route('/logout').post(authController.logout);

module.exports = router;
