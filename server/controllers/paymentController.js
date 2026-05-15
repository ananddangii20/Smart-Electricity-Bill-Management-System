const Razorpay = require('razorpay');
const crypto = require('crypto');

const Bill = require('../models/Bill');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');


// RAZORPAY INSTANCE
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});


// ==============================
// CREATE ORDER
// ==============================
const createPaymentOrder = asyncHandler(async (req, res) => {
  const { billId } = req.body;

  if (!billId) {
    return res.status(400).json({
      success: false,
      message: 'billId is required',
    });
  }

  // CHECK IF RAZORPAY KEYS ARE SET
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({
      success: false,
      message: 'Payment gateway is not configured. Please contact administrator.',
    });
  }

  // FIND BILL
  const bill = await Bill.findById(billId);

  if (!bill) {
    return res.status(404).json({
      success: false,
      message: 'Bill not found',
    });
  }

  // SECURITY CHECK
  if (
    bill.userId.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized to pay this bill',
    });
  }

  // ALREADY PAID
  if (bill.status === 'paid') {
    return res.status(400).json({
      success: false,
      message: 'Bill is already paid',
    });
  }

  // FIND USER
  const user = await User.findById(bill.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  try {

    // CREATE ORDER
    const options = {
      amount: Math.round(bill.amount * 100), // paise
      currency: 'INR',
      receipt: `receipt_${bill._id}`,
      notes: {
        billId: bill._id.toString(),
        userId: user._id.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
      amount: bill.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: 'Payment order creation failed: ' + error.message,
    });

  }
});




// ==============================
// VERIFY PAYMENT
// ==============================
const verifyPayment = asyncHandler(async (req, res) => {

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    billId,
  } = req.body;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !billId
  ) {
    return res.status(400).json({
      success: false,
      message: 'All payment fields are required',
    });
  }

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: 'Invalid signature',
    });
  }

  const bill = await Bill.findById(billId);

  if (!bill) {
    return res.status(404).json({
      success: false,
      message: 'Bill not found',
    });
  }

  bill.status = 'paid';
  bill.paidAt = new Date();
  bill.paymentMethod = 'razorpay';
  bill.transactionId = razorpay_payment_id;

  await bill.save();

  res.status(200).json({
    success: true,
    message: 'Payment successful',
    bill,
  });

});









// ==============================
// MOCK PAYMENT (OPTIONAL)
// ==============================
const getMockPaymentIntent = asyncHandler(async (req, res) => {

  const { billId } = req.body;

  if (!billId) {
    return res.status(400).json({
      message: 'billId is required',
    });
  }

  const bill = await Bill.findById(billId);

  if (!bill) {
    return res.status(404).json({
      message: 'Bill not found',
    });
  }

  if (
    bill.userId.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      message: 'Unauthorized',
    });
  }

  if (bill.status === 'paid') {
    return res.status(400).json({
      message: 'Bill already paid',
    });
  }

  return res.status(200).json({
    mockPaymentId: `mock_${bill._id}_${Date.now()}`,
    amount: bill.amount,
    billId: bill._id,
  });

});




// ==============================
// CONFIRM MOCK PAYMENT
// ==============================
const confirmMockPayment = asyncHandler(async (req, res) => {

  const { billId, mockPaymentId } = req.body;

  if (!billId || !mockPaymentId) {
    return res.status(400).json({
      message: 'billId and mockPaymentId are required',
    });
  }

  const bill = await Bill.findById(billId);

  if (!bill) {
    return res.status(404).json({
      message: 'Bill not found',
    });
  }

  if (bill.status === 'paid') {
    return res.status(400).json({
      message: 'Bill already paid',
    });
  }

  bill.status = 'paid';

  bill.paidAt = new Date();

  bill.paymentMethod = 'mock';

  bill.transactionId = mockPaymentId;

  await bill.save();

  return res.status(200).json({
    success: true,
    message: 'Mock payment successful',
    bill,
  });

});




module.exports = {
  createPaymentOrder,
  verifyPayment,
  getMockPaymentIntent,
  confirmMockPayment,
};