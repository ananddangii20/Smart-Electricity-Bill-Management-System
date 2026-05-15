import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import BillPDF from '../../components/BillPDF';
import PaymentModal from '../../components/PaymentModal';
import { downloadBillPDF } from '../../utils/billPDF';
import useAuth from '../../hooks/useAuth';

const BillDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        const fetchBill = async () => {
            try {
                const response = await api.get(`/user/bills/${id}`);
                setBill(response.data);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Unable to load bill details');
            } finally {
                setLoading(false);
            }
        };

        fetchBill();
    }, [id]);

    const handlePaymentSuccess = (updatedBill) => {
        setBill(updatedBill);
        setShowPaymentModal(false);
    };

    const handleDownloadPDF = async () => {
        try {
            await downloadBillPDF(bill, user);
            toast.success('Bill downloaded successfully');
        } catch (error) {
            toast.error('Failed to download bill');
        }
    };

    if (loading) return <Spinner />;
    if (!bill) return <p className="text-slate-600">Bill not found.</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Bill Details</h2>
            
            {/* Bill Summary Card */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="card p-5">
                    <p className="text-sm text-slate-500">Bill ID</p>
                    <p className="mt-2 font-mono text-sm font-semibold text-slate-900">{bill._id}</p>
                </div>
                <div className="card p-5">
                    <p className="text-sm text-slate-500">Units Consumed</p>
                    <p className="mt-2 text-2xl font-bold text-teal-700">{bill.units}</p>
                </div>
                <div className="card p-5">
                    <p className="text-sm text-slate-500">Amount Due</p>
                    <p className="mt-2 text-2xl font-bold text-teal-700">Rs. {bill.amount}</p>
                </div>
                <div className="card p-5">
                    <p className="text-sm text-slate-500">Status</p>
                    <p className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                        bill.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    } capitalize`}>
                        {bill.status}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
                <button
                    onClick={handleDownloadPDF}
                    className="rounded-lg border border-teal-700 px-6 py-2 font-semibold text-teal-700 hover:bg-teal-50"
                >
                    📥 Download as PDF
                </button>
                {bill.status === 'unpaid' && (
                    <button
                        onClick={() => setShowPaymentModal(true)}
                        className="rounded-lg bg-teal-700 px-6 py-2 font-semibold text-white hover:bg-teal-600"
                    >
                        💳 Pay Now
                    </button>
                )}
            </div>

            {/* Full Bill Details */}
            <div className="card p-8">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold mb-4">Billing Information</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-slate-500">Bill Generated</p>
                                <p className="font-semibold">{new Date(bill.createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Due Date</p>
                                <p className="font-semibold">
                                    {new Date(new Date(bill.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <hr className="my-4" />

                    <div>
                        <h3 className="text-lg font-bold mb-4">Customer Information</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm text-slate-500">Name</p>
                                <p className="font-semibold">{user?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Email</p>
                                <p className="font-semibold">{user?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Meter Number</p>
                                <p className="font-semibold">{user?.meterNumber}</p>
                            </div>
                            {user?.address && (
                                <div>
                                    <p className="text-sm text-slate-500">Address</p>
                                    <p className="font-semibold">{user?.address}</p>
                                </div>
                            )}
                            {user?.phone && (
                                <div>
                                    <p className="text-sm text-slate-500">Phone</p>
                                    <p className="font-semibold">{user?.phone}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <hr className="my-4" />

                    <div>
                        <h3 className="text-lg font-bold mb-4">Consumption & Charges</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Description</th>
                                        <th className="px-4 py-3 text-right">Units (kWh)</th>
                                        <th className="px-4 py-3 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t border-slate-200">
                                        <td className="px-4 py-3">Electricity Consumption</td>
                                        <td className="px-4 py-3 text-right font-semibold">{bill.units}</td>
                                        <td className="px-4 py-3 text-right font-semibold">Rs. {bill.amount}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <hr className="my-4" />

                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total Amount Due:</span>
                            <span className="text-2xl font-bold text-teal-700">Rs. {bill.amount}</span>
                        </div>
                    </div>

                    {bill.status === 'paid' && bill.paidAt && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-800 font-semibold">
                                ✓ Paid on {new Date(bill.paidAt).toLocaleDateString()}
                            </p>
                            {bill.transactionId && (
                                <p className="text-sm text-green-700 mt-1">
                                    Transaction ID: {bill.transactionId}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden PDF Component */}
            <BillPDF bill={bill} user={user} />

            {/* Payment Modal */}
            {showPaymentModal && (
                <PaymentModal 
                    bill={bill} 
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

export default BillDetailsPage;
