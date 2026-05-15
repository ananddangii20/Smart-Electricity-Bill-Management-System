import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import PaymentModal from '../../components/PaymentModal';
import Spinner from '../../components/Spinner';

const UserDashboardPage = () => {
    const [data, setData] = useState(null);
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBill, setSelectedBill] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [dashboardResponse, billsResponse] = await Promise.all([
                    api.get('/user/dashboard'),
                    api.get('/user/bills'),
                ]);

                setData(dashboardResponse.data);
                setBills(billsResponse.data);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) return <Spinner />;

    const latestBill = data?.latestBill || bills[0] || null;
    const paidBills = bills.filter((bill) => bill.status === 'paid');
    const unpaidBills = bills.filter((bill) => bill.status !== 'paid');

    const handlePaymentSuccess = (updatedBill) => {
        setBills((prevBills) =>
            prevBills.map((bill) => (bill._id === updatedBill._id ? updatedBill : bill))
        );

        setData((prevData) =>
            prevData
                ? {
                    ...prevData,
                    latestBill:
                        prevData.latestBill?._id === updatedBill._id
                            ? updatedBill
                            : prevData.latestBill,
                }
                : prevData
        );

        setSelectedBill(null);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">User Dashboard</h2>

            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
                <div className="card p-5">
                    <p className="text-sm text-slate-500">Latest Bill Amount</p>
                    <p className="mt-2 text-2xl font-bold text-teal-700">
                        {latestBill ? `Rs. ${latestBill.amount}` : 'N/A'}
                    </p>
                </div>
                <div className="card p-5">
                    <p className="text-sm text-slate-500">Units Consumed</p>
                    <p className="mt-2 text-2xl font-bold text-teal-700">
                        {latestBill ? latestBill.units : 'N/A'}
                    </p>
                </div>
                <div className="card p-5">
                    <p className="text-sm text-slate-500">Bill Status</p>
                    <p
                        className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${latestBill?.status === 'paid'
                                ? 'bg-green-100 text-green-800'
                                : latestBill?.status === 'unpaid'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-slate-100 text-slate-700'
                            }`}
                    >
                        {latestBill?.status || 'N/A'}
                    </p>
                </div>
                <div className="card p-5">
                    <p className="text-sm text-slate-500">Unpaid Bills</p>
                    <p className="mt-2 text-2xl font-bold text-red-700">{unpaidBills.length}</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="card p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <h3 className="text-xl font-semibold">Recent Bill</h3>
                            <p className="text-sm text-slate-500">The most recent bill is shown here with a direct payment option.</p>
                        </div>
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${latestBill?.status === 'paid'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                        >
                            {latestBill?.status || 'No bill'}
                        </span>
                    </div>

                    {latestBill ? (
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                <div>
                                    <p className="text-sm text-slate-500">Amount</p>
                                    <p className="mt-1 text-lg font-semibold">Rs. {latestBill.amount}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Units</p>
                                    <p className="mt-1 text-lg font-semibold">{latestBill.units}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Generated</p>
                                    <p className="mt-1 text-lg font-semibold">{new Date(latestBill.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Action</p>
                                    <p className="mt-1 text-lg font-semibold">
                                        <Link className="text-teal-700 hover:underline" to={`/bills/${latestBill._id}`}>
                                            View details
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            {latestBill.status === 'unpaid' && (
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => setSelectedBill(latestBill)}
                                        className="rounded-lg bg-teal-700 px-5 py-2 font-semibold text-white hover:bg-teal-600"
                                    >
                                        Pay Now
                                    </button>
                                    <Link
                                        to={`/bills/${latestBill._id}`}
                                        className="rounded-lg border border-teal-700 px-5 py-2 font-semibold text-teal-700 hover:bg-teal-50"
                                    >
                                        Open bill
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-slate-500">No bills available yet.</p>
                    )}
                </div>

                <div className="card p-6">
                    <h3 className="text-xl font-semibold">Billing Summary</h3>
                    <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                            <span className="text-sm text-slate-600">Total Bills</span>
                            <span className="font-semibold">{bills.length}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-3">
                            <span className="text-sm text-green-700">Paid</span>
                            <span className="font-semibold text-green-800">{paidBills.length}</span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-3">
                            <span className="text-sm text-red-700">Pending</span>
                            <span className="font-semibold text-red-800">{unpaidBills.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card overflow-x-auto p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                        <h3 className="text-xl font-semibold">All Bills</h3>
                        <p className="text-sm text-slate-500">Review every bill and pay unpaid ones directly from this page.</p>
                    </div>
                    <p className="text-sm text-slate-500">{bills.length} records</p>
                </div>

                <table className="min-w-full text-sm">
                    <thead className="bg-slate-100 text-left text-slate-700">
                        <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Units</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map((bill) => (
                            <tr key={bill._id} className="border-t border-slate-200">
                                <td className="px-4 py-3">{new Date(bill.createdAt).toLocaleDateString()}</td>
                                <td className="px-4 py-3">{bill.units}</td>
                                <td className="px-4 py-3">Rs. {bill.amount}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${bill.status === 'paid'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {bill.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-2">
                                        <Link className="font-semibold text-teal-700 hover:underline" to={`/bills/${bill._id}`}>
                                            View
                                        </Link>
                                        {bill.status === 'unpaid' && (
                                            <button
                                                onClick={() => setSelectedBill(bill)}
                                                className="font-semibold text-amber-700 hover:underline"
                                            >
                                                Pay Now
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {bills.length === 0 && (
                            <tr>
                                <td className="px-4 py-6 text-slate-500" colSpan={5}>
                                    No bills available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedBill && (
                <PaymentModal
                    bill={selectedBill}
                    onClose={() => setSelectedBill(null)}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

export default UserDashboardPage;
