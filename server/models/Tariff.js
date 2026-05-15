const mongoose = require('mongoose');

const tariffSchema = new mongoose.Schema(
    {
        slabs: [
            {
                min: { type: Number, required: true, min: 0 },
                max: { type: Number, required: true, min: 0 },
                rate: { type: Number, required: true, min: 0 },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Tariff', tariffSchema);
