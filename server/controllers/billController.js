const Bill = require('../models/Bill');
const MeterReading = require('../models/MeterReading');
const Tariff = require('../models/Tariff');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { calculateBillAmount } = require('../utils/billing');

const generateBillForUser = async (userId) => {
    const tariff = await Tariff.findOne().sort({ createdAt: -1 });
    if (!tariff || !tariff.slabs || tariff.slabs.length === 0) {
        throw new Error('Tariff is not configured');
    }

    const latestReading = await MeterReading.findOne({ userId }).sort({ date: -1 });
    if (!latestReading) {
        throw new Error('Meter reading not found for user');
    }

    const units = Number(latestReading.currentReading) - Number(latestReading.previousReading);
    if (units < 0) {
        throw new Error('Invalid reading values');
    }

    const amount = calculateBillAmount(units, tariff.slabs);
    return Bill.create({ userId, units, amount, status: 'unpaid' });
};

const generateBill = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const bill = await generateBillForUser(userId);
    return res.status(201).json({ message: 'Bill generated', bill });
});

const generateAllBills = asyncHandler(async (req, res) => {
    const users = await User.find({ role: 'user' }).select('_id');
    const results = [];

    for (const user of users) {
        try {
            const bill = await generateBillForUser(user._id);
            results.push({ userId: user._id, success: true, billId: bill._id });
        } catch (error) {
            results.push({ userId: user._id, success: false, error: error.message });
        }
    }

    return res.status(200).json({ message: 'Bill generation completed', results });
});

const listBillsForAdmin = asyncHandler(async (req, res) => {
    const bills = await Bill.find()
        .populate('userId', 'name email meterNumber')
        .sort({ createdAt: -1 });

    return res.status(200).json(bills);
});

module.exports = {
    generateBill,
    generateAllBills,
    generateBillForUser,
    listBillsForAdmin,
};
