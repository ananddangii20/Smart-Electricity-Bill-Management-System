import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const GenerateBillsPage = () => {
    const [userId, setUserId] = useState('');
    const [results, setResults] = useState([]);

    const generateOne = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/bill/generate', { userId });
            toast.success(data.message || 'Bill generated');
            setResults([{ userId, success: true, billId: data.bill?._id }, ...results]);
            setUserId('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate bill');
        }
    };

    const generateAll = async () => {
        try {
            const { data } = await api.post('/bill/generate-all');
            toast.success('All bills generation completed');
            setResults(data.results || []);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate all bills');
        }
    };

    return (
        <div className="space-y-6">
            <div className="card p-6">
                <h2 className="text-2xl font-bold">Generate Bills</h2>
                <form className="mt-4 flex flex-col gap-3 md:flex-row" onSubmit={generateOne}>
                    <input
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="User ID"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        required
                    />
                    <button className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-600">
                        Generate One
                    </button>
                    <button
                        type="button"
                        onClick={generateAll}
                        className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-slate-900 hover:bg-amber-400"
                    >
                        Generate All
                    </button>
                </form>
            </div>

            <div className="card overflow-x-auto p-4">
                <h3 className="mb-3 text-lg font-semibold">Last Generation Results</h3>
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-100 text-left">
                        <tr>
                            <th className="px-4 py-3">User ID</th>
                            <th className="px-4 py-3">Success</th>
                            <th className="px-4 py-3">Bill ID / Error</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((item, idx) => (
                            <tr key={`${item.userId}-${idx}`} className="border-t border-slate-200">
                                <td className="px-4 py-3">{item.userId}</td>
                                <td className="px-4 py-3">{item.success ? 'Yes' : 'No'}</td>
                                <td className="px-4 py-3">{item.billId || item.error || '-'}</td>
                            </tr>
                        ))}
                        {results.length === 0 && (
                            <tr>
                                <td className="px-4 py-6 text-slate-500" colSpan={3}>
                                    No generation run yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GenerateBillsPage;
