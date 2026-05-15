const Bill = require('../models/Bill');
const asyncHandler = require('../utils/asyncHandler');

const getDashboard = asyncHandler(async (req, res) => {
    const latestBill = await Bill.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    const totalBills = await Bill.countDocuments({ userId: req.user._id });

    return res.status(200).json({
        user: req.user,
        latestBill,
        totalBills,
    });
});

const getBills = asyncHandler(async (req, res) => {
    const bills = await Bill.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(bills);
});

const getBillById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const bill = await Bill.findOne({ _id: id, userId: req.user._id });

    if (!bill) {
        return res.status(404).json({ message: 'Bill not found' });
    }

    return res.status(200).json(bill);
});

module.exports = {
    getDashboard,
    getBills,
    getBillById,
};
