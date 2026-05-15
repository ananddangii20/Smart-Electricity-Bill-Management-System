import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const initialForm = {
    name: '',
    email: '',
    password: '',
    role: 'user',
    meterNumber: '',
    address: '',
    phone: '',
};

const ManageUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(initialForm);

    const loadUsers = async () => {
        const response = await api.get('/admin/users');
        setUsers(response.data);
    };

    useEffect(() => {
        const init = async () => {
            try {
                await loadUsers();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    const onChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const createUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/user', form);
            toast.success('User created');
            setForm(initialForm);
            await loadUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create user');
        }
    };

    const removeUser = async (id) => {
        try {
            await api.delete(`/admin/user/${id}`);
            toast.success('User deleted');
            await loadUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="space-y-8">
            <div className="card p-6">
                <h3 className="text-xl font-semibold">Add New User</h3>
                <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={createUser}>
                    <input name="name" value={form.name} onChange={onChange} placeholder="Name" className="rounded-lg border border-slate-300 px-3 py-2" required />
                    <input name="email" value={form.email} onChange={onChange} placeholder="Email" className="rounded-lg border border-slate-300 px-3 py-2" required />
                    <input name="meterNumber" value={form.meterNumber} onChange={onChange} placeholder="Meter Number" className="rounded-lg border border-slate-300 px-3 py-2" required />
                    <input name="address" value={form.address} onChange={onChange} placeholder="Address" className="rounded-lg border border-slate-300 px-3 py-2" />
                    <input name="phone" value={form.phone} onChange={onChange} placeholder="Phone" className="rounded-lg border border-slate-300 px-3 py-2" />
                    <input name="password" value={form.password} onChange={onChange} placeholder="Password" type="password" className="rounded-lg border border-slate-300 px-3 py-2" required />
                    <select name="role" value={form.role} onChange={onChange} className="rounded-lg border border-slate-300 px-3 py-2">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-600">Create</button>
                </form>
            </div>

            <div className="card overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-100 text-left">
                        <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Meter</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-t border-slate-200">
                                <td className="px-4 py-3">{user.name}</td>
                                <td className="px-4 py-3">{user.email}</td>
                                <td className="px-4 py-3 capitalize">{user.role}</td>
                                <td className="px-4 py-3">{user.meterNumber}</td>
                                <td className="px-4 py-3">
                                    <button
                                        className="rounded-md bg-red-500 px-3 py-1 text-white hover:bg-red-400"
                                        onClick={() => removeUser(user._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsersPage;
