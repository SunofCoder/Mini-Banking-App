import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext'; // AuthContext'ten useAuth hook'unu import et
import Notification from '../../components/Notification'; // Bildirim bileşenini import et

// TransferMoney bileşeni
const TransferMoney = ({ fromAccountId }) => {
    const { token } = useAuth(); // JWT token'ı
    const [toAccountNumber, setToAccountNumber] = useState(''); // Hedef hesap numarası state'i
    const [amount, setAmount] = useState(''); // Miktar state'i
    const [notification, setNotification] = useState(null); // Bildirim state'i

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification(null); // Önceki bildirimi temizle
        try {
            const response = await fetch('http://localhost:8080/api/transactions/transfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Yetkilendirme başlığı
                },
                body: JSON.stringify({
                    fromAccountId, // Kaynak hesap ID'si (prop olarak gelir)
                    toAccountNumber, // Hedef hesap numarası
                    amount: parseFloat(amount), // Miktar string'den sayıya dönüştürülür
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Transfer başarısız oldu');
            }

            setNotification({ message: 'Para başarıyla transfer edildi!', type: 'success' });
            setToAccountNumber(''); // Formu temizle
            setAmount('');
            setTimeout(() => {
                window.location.hash = `#/accounts/${fromAccountId}`; // 1.5 saniye sonra kaynak hesap detaylarına yönlendir
            }, 1500);
        } catch (err) {
            setNotification({ message: err.message, type: 'error' });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Para Transferi</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="fromAccountId">
                            Kaynak Hesap ID'si
                        </label>
                        <input
                            type="text"
                            id="fromAccountId"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                            value={fromAccountId}
                            readOnly // Kaynak hesap ID'si değiştirilemez
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="toAccountNumber">
                            Hedef Hesap Numarası
                        </label>
                        <input
                            type="text"
                            id="toAccountNumber"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            value={toAccountNumber}
                            onChange={(e) => setToAccountNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="amount">
                            Miktar
                        </label>
                        <input
                            type="number"
                            id="amount"
                            step="0.01" // Ondalık sayılara izin ver
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
                    >
                        Transferi Başlat
                    </button>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    <a href={`#/accounts/${fromAccountId}`} className="text-blue-600 hover:underline font-medium">
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

export default TransferMoney;
