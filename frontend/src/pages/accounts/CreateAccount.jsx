import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import Notification from '../../components/Notification';

const CreateAccount = () => {
    const { token } = useAuth();
    const [accountName, setAccountName] = useState('');
    const [balance, setBalance] = useState('');
    const [notification, setNotification] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification(null);
        try {
            const response = await fetch('http://localhost:8080/api/accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    accountName,
                    balance: parseFloat(balance),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Hesap oluşturulamadı');
            }

            setNotification({ message: 'Hesap başarıyla oluşturuldu!', type: 'success' });
            setAccountName('');
            setBalance('');
            setTimeout(() => {
                window.location.hash = '#/accounts'; // Hesap oluşturulduktan sonra hesap listesine yönlendir
            }, 1500);
        } catch (err) {
            setNotification({ message: err.message, type: 'error' });
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Yeni Hesap Oluştur</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="accountName">
                            Hesap Adı
                        </label>
                        <input
                            type="text"
                            id="accountName"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="balance">
                            Başlangıç Bakiyesi
                        </label>
                        <input
                            type="number"
                            id="balance"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
                    >
                        Hesap Oluştur
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    <a href="#/dashboard" className="text-blue-600 hover:underline font-medium">
                        Gösterge Paneline Geri Dön
                    </a>
                </p>
            </div>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default CreateAccount;
