const cron = require('node-cron');
const User = require('../models/User');
const { generateBillForUser } = require('../controllers/billController');

const startMonthlyBillingCron = () => {
    cron.schedule('0 0 1 * *', async () => {
        console.log('Running monthly billing cron job...');
        try {
            const users = await User.find({ role: 'user' }).select('_id');
            for (const user of users) {
                try {
                    await generateBillForUser(user._id);
                } catch (error) {
                    console.error(`Billing failed for user ${user._id}:`, error.message);
                }
            }
            console.log('Monthly billing cron job completed');
        } catch (error) {
            console.error('Monthly billing cron job failed:', error.message);
        }
    });
};

module.exports = startMonthlyBillingCron;
