const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const ADMIN_CREDENTIALS = {
    email: 'admin@ebms.com',
    password: 'Admin@12345',
};

const generateToken = (id, role) =>
    jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const register = asyncHandler(async (req, res) => {
    const { name, email, password, meterNumber, address, phone } = req.body;

    if (!name || !email || !password || !meterNumber) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
    }

    const existingMeter = await User.findOne({ meterNumber });
    if (existingMeter) {
        return res.status(409).json({ message: 'Meter number already assigned' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'user',
        meterNumber,
        address,
        phone,
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
        token,
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

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    let user = await User.findOne({ email });

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        if (!user) {
            const hashedPassword = await bcrypt.hash(ADMIN_CREDENTIALS.password, 10);
            user = await User.create({
                name: 'Administrator',
                email: ADMIN_CREDENTIALS.email,
                password: hashedPassword,
                role: 'admin',
                meterNumber: 'ADMIN-001',
            });
        } else if (user.role !== 'admin') {
            user.role = 'admin';
            await user.save();
        }
    } else {
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
        token,
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

module.exports = {
    register,
    login,
};
