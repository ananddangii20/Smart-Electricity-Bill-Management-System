import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const getNav = (role) => {
    if (role === 'admin') {
        return [
            { to: '/admin', label: 'Dashboard' },
            { to: '/admin/users', label: 'Manage Users' },
            { to: '/admin/meter', label: 'Add Meter Reading' },
            { to: '/admin/tariff', label: 'Tariff Setup' },
            { to: '/admin/generate', label: 'Generate Bills' },
        ];
    }

    return [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/bills', label: 'Bill History' },
    ];
};

const SidebarLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const navItems = getNav(user?.role);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen">
            <aside className="w-72 border-r border-teal-900/20 bg-[#0f172a] p-6 text-white">
                <h1 className="text-2xl font-bold tracking-tight">EBMS</h1>
                <p className="mt-1 text-sm text-slate-300">Electricity Bill System</p>

                <nav className="mt-8 space-y-2">
                    {navItems.map((item) => {
                        const active = location.pathname === item.to;
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`block rounded-xl px-4 py-2 text-sm transition ${active ? 'bg-teal-600 text-white' : 'text-slate-200 hover:bg-slate-800'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-10 rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-400">Logged in as</p>
                    <p className="mt-1 font-semibold">{user?.name}</p>
                    <p className="text-sm text-slate-300">{user?.role}</p>
                    <button
                        onClick={handleLogout}
                        className="mt-4 w-full rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-6 md:p-10">
                <div className="fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default SidebarLayout;
