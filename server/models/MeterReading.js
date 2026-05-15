
















const mongoose = require('mongoose');

const meterReadingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        previousReading: {
            type: Number,
            required: true,
            min: 0,
        },
        currentReading: {
            type: Number,
            required: true,
            min: 0,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('MeterReading', meterReadingSchema);
