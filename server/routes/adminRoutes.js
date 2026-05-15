const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
    createUser,
    updateUser,
    deleteUser,
    listUsers,
} = require('../controllers/adminController');
const { listBillsForAdmin } = require('../controllers/billController');

const router = express.Router();

router.use(authMiddleware, roleMiddleware('admin'));

router.get('/users', listUsers);
router.get('/bills', listBillsForAdmin);
router.post('/user', createUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

module.exports = router;
