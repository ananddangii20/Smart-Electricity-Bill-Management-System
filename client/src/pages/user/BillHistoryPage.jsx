import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const BillHistoryPage = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const response = await api.get('/user/bills');
                setBills(response.data);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Unable to load bills');
            } finally {
                setLoading(false);
            }
        };

        fetchBills();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Bill History</h2>

            <div className="card overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-100 text-left text-slate-700">
                        <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Units</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map((bill) => (
                            <tr key={bill._id} className="border-t border-slate-200">
                                <td className="px-4 py-3">{new Date(bill.createdAt).toLocaleDateString()}</td>
                                <td className="px-4 py-3">{bill.units}</td>
                                <td className="px-4 py-3">Rs. {bill.amount}</td>
                                <td className="px-4 py-3 capitalize">{bill.status}</td>
                                <td className="px-4 py-3">
                                    <Link className="font-semibold text-teal-700" to={`/bills/${bill._id}`}>
                                        View
                                    </Link>
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
        </div>
    );
};

export default BillHistoryPage;
