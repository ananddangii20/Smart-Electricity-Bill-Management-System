import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        meterNumber: '',
        address: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);

    const onChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', form);
            toast.success('Registration successful. Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <div className="card w-full max-w-lg p-8">
                <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
                <p className="mt-1 text-sm text-slate-600">Register to manage your electricity bills.</p>

                <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
                    <input
                        name="name"
                        placeholder="Full name"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
                        onChange={onChange}
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
                        onChange={onChange}
                        required
                    />
                    <input
                        name="meterNumber"
                        placeholder="Meter number"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
                        onChange={onChange}
                        required
                    />
                    <input
                        name="address"
                        placeholder="Address (optional)"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
                        onChange={onChange}
                    />
                    <input
                        name="phone"
                        placeholder="Phone (optional)"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
                        onChange={onChange}
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
                        onChange={onChange}
                        required
                    />
                    <button
                        disabled={loading}
                        className="w-full rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white hover:bg-teal-600 disabled:opacity-60"
                    >
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <p className="mt-4 text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-teal-700">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
