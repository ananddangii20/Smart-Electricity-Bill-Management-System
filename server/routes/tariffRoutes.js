const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { setTariff, getTariff } = require('../controllers/tariffController');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin'), setTariff);
router.get('/', authMiddleware, getTariff);

module.exports = router;
