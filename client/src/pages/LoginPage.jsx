import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const onChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', form);
            login(data.token, data.user);
            toast.success('Logged in successfully');
            navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <div className="card w-full max-w-md p-8">
                <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
                <p className="mt-1 text-sm text-slate-600">Sign in to manage electricity billing.</p>
                <p className="mt-2 text-xs text-slate-500">
                    Admin access uses the special admin email and password.
                </p>

                <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600"
                        onChange={onChange}
                        required
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
                        {loading ? 'Signing in...' : 'Login'}
                    </button>
                </form>

                <p className="mt-4 text-sm text-slate-600">
                    New user?{' '}
                    <Link to="/register" className="font-semibold text-teal-700">
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
