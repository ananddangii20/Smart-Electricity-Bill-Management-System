const bcrypt = require('bcryptjs');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, meterNumber, address, phone } = req.body;

    if (!name || !email || !password || !meterNumber) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
        return res.status(409).json({ message: 'Email already registered' });
    }

    const meterExists = await User.findOne({ meterNumber });
    if (meterExists) {
        return res.status(409).json({ message: 'Meter number already assigned' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role === 'admin' ? 'admin' : 'user',
        meterNumber,
        address,
        phone,
    });

    return res.status(201).json({
        message: 'User created successfully',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            meterNumber: user.meterNumber,
            address: user.address,
            phone: user.phone,
        },
    });
});

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, role, meterNumber, password, address, phone } = req.body;

    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(409).json({ message: 'Email already in use' });
        }
    }

    if (meterNumber && meterNumber !== user.meterNumber) {
        const meterExists = await User.findOne({ meterNumber });
        if (meterExists) {
            return res.status(409).json({ message: 'Meter number already in use' });
        }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role === 'admin' ? 'admin' : role === 'user' ? 'user' : user.role;
    user.meterNumber = meterNumber || user.meterNumber;
    user.address = address || user.address;
    user.phone = phone || user.phone;

    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    return res.status(200).json({ message: 'User updated successfully' });
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    await User.deleteOne({ _id: id });
    return res.status(200).json({ message: 'User deleted successfully' });
});

const listUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json(users);
});

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    listUsers,
};
