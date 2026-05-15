const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { addMeterReading } = require('../controllers/meterController');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin'), addMeterReading);

module.exports = router;
