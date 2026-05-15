import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const AdminDashboardPage = () => {
    const [users, setUsers] = useState([]);
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [usersResponse, billsResponse] = await Promise.all([
                    api.get('/admin/users'),
                    api.get('/admin/bills'),
                ]);

                setUsers(usersResponse.data);
                setBills(billsResponse.data);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to load admin dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <Spinner />;

    const totalUsers = users.filter((u) => u.role === 'user').length;
    const totalAdmins = users.filter((u) => u.role === 'admin').length;
    const paidBills = bills.filter((bill) => bill.status === 'paid');
    const unpaidBills = bills.filter((bill) => bill.status !== 'paid');

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Admin Dashboard</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="card p-5">
                    <p className="text-sm text-slate-500">Total Users</p>
                    <p className="mt-2 text-3xl font-bold text-teal-700">{totalUsers}</p>
                </div>
                <div className="card p-5">
                    <p className="text-sm text-slate-500">Total Admins</p>
                    <p className="mt-2 text-3xl font-bold text-teal-700">{totalAdmins}</p>
                </div>
                <div className="card p-5">
                    <p className="text-sm text-slate-500">Paid Bills</p>
                    <p className="mt-2 text-3xl font-bold text-green-700">{paidBills.length}</p>
                </div>
                <div className="card p-5">
                    <p className="text-sm text-slate-500">Unpaid Bills</p>
                    <p className="mt-2 text-3xl font-bold text-red-700">{unpaidBills.length}</p>
                </div>
            </div>

            <div className="card overflow-x-auto p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                        <h3 className="text-xl font-semibold">Bill Payment Status</h3>
                        <p className="text-sm text-slate-500">See which customers have paid and which bills are still pending.</p>
                    </div>
                    <p className="text-sm text-slate-500">{bills.length} total bills</p>
                </div>

                <table className="min-w-full text-sm">
                    <thead className="bg-slate-100 text-left text-slate-700">
                        <tr>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Meter</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Generated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map((bill) => (
                            <tr key={bill._id} className="border-t border-slate-200">
                                <td className="px-4 py-3">
                                    <div className="font-medium text-slate-900">{bill.userId?.name || 'Unknown user'}</div>
                                    <div className="text-xs text-slate-500">{bill.userId?.email || 'No email available'}</div>
                                </td>
                                <td className="px-4 py-3">{bill.userId?.meterNumber || '-'}</td>
                                <td className="px-4 py-3">Rs. {bill.amount}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${bill.status === 'paid'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {bill.status === 'paid' ? 'Paid' : 'Unpaid'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">{new Date(bill.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {bills.length === 0 && (
                            <tr>
                                <td className="px-4 py-6 text-slate-500" colSpan={5}>
                                    No bills have been generated yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
