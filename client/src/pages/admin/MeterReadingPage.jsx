import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const MeterReadingPage = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        userId: '',
        previousReading: '',
        currentReading: '',
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/admin/users');
                setUsers(data.filter((u) => u.role === 'user'));
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to load users');
            }
        };

        fetchUsers();
    }, []);

    const onChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/meter', form);
            toast.success('Meter reading added');
            setForm({ userId: '', previousReading: '', currentReading: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add reading');
        }
    };

    return (
        <div className="card max-w-2xl p-6">
            <h2 className="text-2xl font-bold">Add Meter Reading</h2>
            <form className="mt-4 space-y-4" onSubmit={onSubmit}>
                <select
                    name="userId"
                    value={form.userId}
                    onChange={onChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    required
                >
                    <option value="">Select user</option>
                    {users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.name} - {user.meterNumber}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    name="previousReading"
                    value={form.previousReading}
                    onChange={onChange}
                    placeholder="Previous reading"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    required
                />
                <input
                    type="number"
                    name="currentReading"
                    value={form.currentReading}
                    onChange={onChange}
                    placeholder="Current reading"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    required
                />

                <button className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-600">
                    Save Reading
                </button>
            </form>
        </div>
    );
};

export default MeterReadingPage;
