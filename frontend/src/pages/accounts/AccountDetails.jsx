import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext'; // AuthContext'ten useAuth hook'unu import et

// AccountDetails bileşeni
const AccountDetails = ({ accountId }) => {
    const { token } = useAuth(); // JWT token'ı
    const [account, setAccount] = useState(null); // Hesap detayları state'i
    const [loading, setLoading] = useState(true); // Yükleme durumu
    const [error, setError] = useState(null); // Hata durumu

    // Hesap detaylarını API'den çekme fonksiyonu
    useEffect(() => {
        const fetchAccountDetails = async () => {
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
                    throw new Error(errorData.message || 'Hesap detayları alınamadı');
                }

                const data = await response.json();
                setAccount(data); // Hesap detaylarını state'e kaydet
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (accountId && token) { // accountId ve token varsa çek
            fetchAccountDetails();
        }
    }, [accountId, token]); // accountId veya token değiştiğinde tekrar çek

    if (loading) return <div className="text-center py-8 text-gray-600">Hesap detayları yükleniyor...</div>;
    if (error) return <div className="text-center py-8 text-red-600">Hata: {error}</div>;
    if (!account) return <div className="text-center py-8 text-gray-500">Hesap bulunamadı.</div>;

    return (
        <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Hesap Detayları</h2>
            <div className="bg-blue-50 p-8 rounded-lg shadow-md border border-blue-200 max-w-lg mx-auto">
                <p className="text-lg text-gray-700 mb-2">
                    <span className="font-semibold">Hesap Adı:</span> {account.accountName}
                </p>
                <p className="text-lg text-gray-700 mb-2">
                    <span className="font-semibold">Hesap Numarası:</span> {account.accountNumber}
                </p>
                <p className="text-lg text-gray-700 mb-2">
                    <span className="font-semibold">Bakiye:</span> <span className="text-green-600 font-bold text-xl">${parseFloat(account.balance).toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-500 mt-4">
                    Oluşturulma Tarihi: {new Date(account.createdAt).toLocaleString()}
                </p>
                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                    <a
                        href={`#/accounts/update/${account.id}`}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
                    >
                        Hesabı Güncelle
                    </a>
                    <a
                        href={`#/transfer/${account.id}`}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
                    >
                        Para Transferi
                    </a>
                    <a
                        href={`#/transactions/${account.id}`}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
                    >
                        İşlem Geçmişini Görüntüle
                    </a>
                </div>
            </div>
            <div className="text-center mt-8">
                <a href="#/dashboard" className="text-blue-600 hover:underline font-medium">
                    Gösterge Paneline Geri Dön
                </a>
            </div>
        </div>
    );
};

export default AccountDetails;
