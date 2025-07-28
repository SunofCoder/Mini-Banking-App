import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext'; // AuthContext'ten useAuth hook'unu import et

// TransactionHistory bileşeni
const TransactionHistory = ({ accountId }) => {
    const { token } = useAuth(); // JWT token'ı
    const [transactions, setTransactions] = useState([]); // İşlem listesi state'i
    const [loading, setLoading] = useState(true); // Yükleme durumu
    const [error, setError] = useState(null); // Hata durumu

    // İşlem geçmişini API'den çekme fonksiyonu
    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:8080/api/transactions/account/${accountId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Yetkilendirme başlığı
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'İşlemler alınamadı');
                }

                const data = await response.json();
                setTransactions(data); // İşlemleri state'e kaydet
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (accountId && token) { // accountId ve token varsa çek
            fetchTransactions();
        }
    }, [accountId, token]); // accountId veya token değiştiğinde tekrar çek

    if (loading) return <div className="text-center py-8 text-gray-600">İşlemler yükleniyor...</div>;
    if (error) return <div className="text-center py-8 text-red-600">Hata: {error}</div>;

    return (
        <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">İşlem Geçmişi</h2>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                {transactions.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">Bu hesap için işlem bulunamadı.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
                            <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                            <tr>
                                <th className="py-3 px-6 text-left">ID</th>
                                <th className="py-3 px-6 text-left">Kaynak Hesap</th>
                                <th className="py-3 px-6 text-left">Hedef Hesap</th>
                                <th className="py-3 px-6 text-right">Miktar</th>
                                <th className="py-3 px-6 text-left">Tarih</th>
                                <th className="py-3 px-6 text-left">Durum</th>
                            </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left whitespace-nowrap">{tx.id}</td>
                                    {/* fromAccount ve toAccount null olabilir, kontrol etmeliyiz */}
                                    <td className="py-3 px-6 text-left">{tx.fromAccount?.accountNumber || 'N/A'}</td>
                                    <td className="py-3 px-6 text-left">{tx.toAccount?.accountNumber || 'N/A'}</td>
                                    <td className="py-3 px-6 text-right font-medium text-green-600">${parseFloat(tx.amount).toFixed(2)}</td>
                                    <td className="py-3 px-6 text-left">{new Date(tx.transactionDate).toLocaleString()}</td>
                                    <td className="py-3 px-6 text-left">
                      <span className={`py-1 px-3 rounded-full text-xs font-semibold ${
                          tx.status === 'SUCCESS' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                      }`}>
                        {tx.status}
                      </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className="text-center mt-8">
                <a href={`#/accounts/${accountId}`} className="text-blue-600 hover:underline font-medium">
                    Hesap Detaylarına Geri Dön
                </a>
            </div>
        </div>
    );
};

export default TransactionHistory;
