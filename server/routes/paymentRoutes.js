const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');

const {
  createPaymentOrder,
  verifyPayment,
  getMockPaymentIntent,
  confirmMockPayment,
} = require('../controllers/paymentController');

const router = express.Router();


// =======================
// RAZORPAY ROUTES
// =======================

router.post(
  '/create-order',
  authMiddleware,
  createPaymentOrder
);

router.post(
  '/verify-payment',
  authMiddleware,
  verifyPayment
);


// =======================
// MOCK PAYMENT ROUTES
// =======================

router.post(
  '/mock-intent',
  authMiddleware,
  getMockPaymentIntent
);

router.post(
  '/confirm-mock',
  authMiddleware,
  confirmMockPayment
);


module.exports = router;