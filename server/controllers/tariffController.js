const Tariff = require('../models/Tariff');
const asyncHandler = require('../utils/asyncHandler');

const setTariff = asyncHandler(async (req, res) => {
    const { slabs } = req.body;

    if (!Array.isArray(slabs) || slabs.length === 0) {
        return res.status(400).json({ message: 'slabs array is required' });
    }

    const isValid = slabs.every((slab) => (
        slab.min !== undefined
        && slab.max !== undefined
        && slab.rate !== undefined
        && slab.min >= 0
        && slab.max >= slab.min
        && slab.rate >= 0
    ));

    if (!isValid) {
        return res.status(400).json({ message: 'Invalid slab format' });
    }

    const tariff = await Tariff.create({ slabs });
    return res.status(201).json({ message: 'Tariff saved', tariff });
});

const getTariff = asyncHandler(async (req, res) => {
    const tariff = await Tariff.findOne().sort({ createdAt: -1 });
    return res.status(200).json(tariff || { slabs: [] });
});

module.exports = {
    setTariff,
    getTariff,
};
