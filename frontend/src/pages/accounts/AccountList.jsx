import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import Notification from '../../components/Notification';

const AccountList = () => {
    const { token } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState(null);

    const fetchAccounts = async (query = '') => {
        setLoading(true);
        setError(null);
        try {
            const url = query ? `http://localhost:8080/api/accounts/search?name=${query}` : `http://localhost:8080/api/accounts/search`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Hesaplar alınamadı');
            }

            const data = await response.json();
            setAccounts(data);
        } catch (err) {
            setError(err.message);
            setNotification({ message: err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async (accountId) => {
        const confirmed = window.confirm('Bu hesabı silmek istediğinizden emin misiniz?');
        if (!confirmed) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/api/accounts/${accountId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Hesap silinemedi');
            }

            setNotification({ message: 'Hesap başarıyla silindi!', type: 'success' });
            fetchAccounts();
        } catch (err) {
            setNotification({ message: err.message, type: 'error' });
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, [token]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchAccounts(searchQuery);
    };

    if (loading) return <div className="text-center py-8 text-gray-600 text-xl font-semibold">Hesaplar yükleniyor...</div>;
    if (error) return (
        <div className="text-center py-8 text-red-600 text-xl font-semibold">
            Hata: {error}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );

    return (
        <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Hesaplarınız</h2>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <form onSubmit={handleSearch} className="flex space-x-2 flex-wrap gap-2">
                    <input
                        type="text"
                        placeholder="Ada göre ara..."
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
                    >
                        Ara
                    </button>
                    <button
                        type="button"
                        onClick={() => { setSearchQuery(''); fetchAccounts(); }}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
                    >
                        Temizle
                    </button>
                </form>
                <a
                    href="#/accounts/create"
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
                >
                    Yeni Hesap Oluştur
                </a>
            </div>

            {accounts.length === 0 ? (
                <p className="text-center text-gray-500 text-lg py-4">Hesap bulunamadı. Başlamak için bir tane oluşturun!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accounts.map((account) => (
                        <div key={account.id} className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200 transform hover:scale-103 transition duration-300">
                            <h3 className="text-xl font-bold text-blue-800 mb-2">{account.accountName}</h3>
                            <p className="text-gray-700">Hesap Numarası: <span className="font-semibold">{account.accountNumber || 'N/A'}</span></p>
                            <p className="text-gray-700 text-lg font-bold mt-2">Bakiye: <span className="text-green-600">${parseFloat(account.balance).toFixed(2)}</span></p>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <a
                                    href={`#/accounts/${account.id}`}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
                                >
                                    Detayları Görüntüle
                                </a>
                                <a
                                    href={`#/accounts/update/${account.id}`}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
                                >
                                    Düzenle
                                </a>
                                <button
                                    onClick={() => handleDeleteAccount(account.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
                                >
                                    Sil
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
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

export default AccountList;
