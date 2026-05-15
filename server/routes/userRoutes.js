const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getDashboard, getBills, getBillById } = require('../controllers/userController');

const router = express.Router();

router.get('/dashboard', authMiddleware, getDashboard);
router.get('/bills', authMiddleware, getBills);
router.get('/bills/:id', authMiddleware, getBillById);

module.exports = router;
