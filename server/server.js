const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const meterRoutes = require('./routes/meterRoutes');
const billRoutes = require('./routes/billRoutes');
const tariffRoutes = require('./routes/tariffRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const startMonthlyBillingCron = require('./cron/monthlyBilling');

dotenv.config();
console.log(process.env.RAZORPAY_KEY_ID);
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(
    cors({
        origin: ['http://localhost:5173', 'http://localhost:5174'],
        credentials: true,
    })
);
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'EBMS API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/meter', meterRoutes);
app.use('/api/bill', billRoutes);
app.use('/api/tariff', tariffRoutes);
app.use('/api/payment', paymentRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use(errorMiddleware);

startMonthlyBillingCron();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
