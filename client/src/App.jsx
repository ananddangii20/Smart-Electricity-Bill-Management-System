import { Navigate, Route, Routes } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import SidebarLayout from './layouts/SidebarLayout';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboardPage from './pages/user/UserDashboardPage';
import BillHistoryPage from './pages/user/BillHistoryPage';
import BillDetailsPage from './pages/user/BillDetailsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import MeterReadingPage from './pages/admin/MeterReadingPage';
import TariffSetupPage from './pages/admin/TariffSetupPage';
import GenerateBillsPage from './pages/admin/GenerateBillsPage';

const HomeRedirect = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
};

const App = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
            element={
                <ProtectedRoute>
                    <SidebarLayout />
                </ProtectedRoute>
            }
        >
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/bills" element={<BillHistoryPage />} />
            <Route path="/bills/:id" element={<BillDetailsPage />} />
        </Route>

        <Route
            element={
                <ProtectedRoute role="admin">
                    <SidebarLayout />
                </ProtectedRoute>
            }
        >
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<ManageUsersPage />} />
            <Route path="/admin/meter" element={<MeterReadingPage />} />
            <Route path="/admin/tariff" element={<TariffSetupPage />} />
            <Route path="/admin/generate" element={<GenerateBillsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
);

export default App;
