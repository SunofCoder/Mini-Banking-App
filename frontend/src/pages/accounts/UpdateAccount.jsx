import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext'; // AuthContext'ten useAuth hook'unu import et
import Notification from '../../components/Notification'; // Bildirim bileşenini import et

// UpdateAccount bileşeni
const UpdateAccount = ({ accountId }) => {
    const { token } = useAuth(); // JWT token'ı
    const [accountName, setAccountName] = useState(''); // Hesap adı state'i
    const [balance, setBalance] = useState(''); // Bakiye state'i (sadece görüntüleme amaçlı)
    const [notification, setNotification] = useState(null); // Bildirim state'i
    const [loading, setLoading] = useState(true); // Yükleme durumu
    const [error, setError] = useState(null); // Hata durumu

    // Güncellenecek hesabı API'den çekme fonksiyonu
    useEffect(() => {
        const fetchAccount = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:8080/api/accounts/${accountId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Yetkilendirme başlığı
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Güncellemek için hesap alınamadı');
                }
                const data = await response.json();
                setAccountName(data.accountName); // Mevcut hesap adını öntanımlı olarak ayarla
                setBalance(data.balance); // Mevcut bakiyeyi öntanımlı olarak ayarla
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (accountId && token) {
            fetchAccount();
        }
    }, [accountId, token]);

    // Form gönderildiğinde
    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification(null); // Önceki bildirimi temizle
        try {
            const response = await fetch(`http://localhost:8080/api/accounts/${accountId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Yetkilendirme başlığı
                },
                body: JSON.stringify({
                    accountName,
                    balance: parseFloat(balance), // Bakiyeyi sayı olarak gönder (API gereksinimine göre)
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Hesap güncellenemedi');
            }

            setNotification({ message: 'Hesap başarıyla güncellendi!', type: 'success' });
            setTimeout(() => {
                window.location.hash = `#/accounts/${accountId}`; // 1.5 saniye sonra hesap detaylarına yönlendir
            }, 1500);
        } catch (err) {
            setNotification({ message: err.message, type: 'error' });
        }
    };

    if (loading) return <div className="text-center py-8 text-gray-600">Hesap verileri yükleniyor...</div>;
    if (error) return <div className="text-center py-8 text-red-600">Hata: {error}</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Hesabı Güncelle</h2>
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
                            Bakiye (Doğrudan buradan güncellenemez)
                        </label>
                        <input
                            type="number"
                            id="balance"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                            value={balance}
                            readOnly // Bakiye transfer ile değişir, doğrudan güncelleme formu ile değil
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
                    >
                        Hesabı Güncelle
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    <a href={`#/accounts/${accountId}`} className="text-blue-600 hover:underline font-medium">
                        Hesap Detaylarına Geri Dön
                    </a>
                </p>
            </div>
            {notification && ( // Bildirim varsa göster
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default UpdateAccount;
