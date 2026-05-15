const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { generateBill, generateAllBills } = require('../controllers/billController');

const router = express.Router();

router.post('/generate', authMiddleware, roleMiddleware('admin'), generateBill);
router.post('/generate-all', authMiddleware, roleMiddleware('admin'), generateAllBills);

module.exports = router;
