import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Header from './components/Header';
import ProtectedRoute from './ProtectedRoute';

// Sayfa bileşenlerini import et
import Login from './auth/Login';
import Register from './auth/Register';
import Dashboard from './pages/Dashboard';
import AccountList from './pages/accounts/AccountList';
import CreateAccount from './pages/accounts/CreateAccount';
import AccountDetails from './pages/accounts/AccountDetails';
import UpdateAccount from './pages/accounts/UpdateAccount';
import TransferMoney from './pages/transactions/TransferMoney';
import TransactionHistory from './pages/transactions/TransactionHistory';

// Ana App bileşeni
export default function App() {
    const [path, setPath] = useState(window.location.hash.slice(1) || '/');

    // Hash değişikliklerini dinle
    useEffect(() => {
        const handleHashChange = () => {
            setPath(window.location.hash.slice(1) || '/');
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    // Rotaya göre doğru bileşeni render et
    const renderRoute = () => {
        if (path === '/' || path === '/dashboard') {
            return (
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            );
        } else if (path === '/login') {
            return <Login />;
        } else if (path === '/register') {
            return <Register />;
        } else if (path === '/accounts') {
            return (
                <ProtectedRoute>
                    <AccountList />
                </ProtectedRoute>
            );
        } else if (path.startsWith('/accounts/create')) {
            return (
                <ProtectedRoute>
                    <CreateAccount />
                </ProtectedRoute>
            );
        } else if (path.startsWith('/accounts/update/')) {
            const accountId = path.split('/accounts/update/')[1];
            return (
                <ProtectedRoute>
                    <UpdateAccount accountId={accountId} />
                </ProtectedRoute>
            );
        } else if (path.startsWith('/accounts/')) {
            const accountId = path.split('/accounts/')[1];
            return (
                <ProtectedRoute>
                    <AccountDetails accountId={accountId} />
                </ProtectedRoute>
            );
        } else if (path.startsWith('/transfer/')) {
            const fromAccountId = path.split('/transfer/')[1];
            return (
                <ProtectedRoute>
                    <TransferMoney fromAccountId={fromAccountId} />
                </ProtectedRoute>
            );
        } else if (path.startsWith('/transactions/')) {
            const accountId = path.split('/transactions/')[1];
            return (
                <ProtectedRoute>
                    <TransactionHistory accountId={accountId} />
                </ProtectedRoute>
            );
        }

        return <AuthRedirector />;
    };

    return (
        <AuthProvider>
            <div className="font-sans antialiased bg-gray-50 min-h-screen flex flex-col">
                {/* Tailwind CSS CDN'i */}
                <script src="https://cdn.tailwindcss.com"></script>
                <Header />
                <main className="flex-grow container mx-auto p-4 md:p-8">
                    {renderRoute()}
                </main>
            </div>
        </AuthProvider>
    );
}

const AuthRedirector = () => {
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (isAuthenticated) {
                if (window.location.hash === '#/login' || window.location.hash === '#/register' || window.location.hash === '#/') {
                    window.location.hash = '#/dashboard';
                }
            } else {
                const currentPath = window.location.hash.slice(1);
                if (currentPath !== '/login' && currentPath !== '/register') {
                    window.location.hash = '#/login';
                }
            }
        }
    }, [isAuthenticated, loading]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-lg font-semibold text-gray-700">Uygulama yükleniyor...</div>
            </div>
        );
    }

    return null;
};
