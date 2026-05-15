const mongoose = require('mongoose');

const billSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        units: {
            type: Number,
            required: true,
            min: 0,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['paid', 'unpaid'],
            default: 'unpaid',
        },
        paidAt: {
            type: Date,
        },
        paymentMethod: {
            type: String,
        },
        transactionId: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Bill', billSchema);
