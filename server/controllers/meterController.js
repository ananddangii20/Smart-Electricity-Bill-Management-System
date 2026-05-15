const MeterReading = require('../models/MeterReading');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const addMeterReading = asyncHandler(async (req, res) => {
    const { userId, previousReading, currentReading, date } = req.body;

    if (!userId || previousReading === undefined || currentReading === undefined) {
        return res.status(400).json({ message: 'userId, previousReading and currentReading are required' });
    }

    if (Number(currentReading) < Number(previousReading)) {
        return res.status(400).json({ message: 'currentReading must be greater than or equal to previousReading' });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const reading = await MeterReading.create({
        userId,
        previousReading: Number(previousReading),
        currentReading: Number(currentReading),
        date: date || new Date(),
    });

    return res.status(201).json({ message: 'Meter reading added', reading });
});

module.exports = {
    addMeterReading,
};
