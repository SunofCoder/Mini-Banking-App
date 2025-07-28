import React from 'react';
import { useAuth } from '../auth/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
                Hoş Geldiniz, {user ? user.username : 'Kullanıcı'}!
            </h1>
            <p className="text-xl text-gray-700 mb-10 text-center max-w-2xl mx-auto">
                Mini Banking Uygulaması Gösterge Paneline Hoş Geldiniz. Hesaplarınızı yönetebilir ve finansal işlemlerinizi gerçekleştirebilirsiniz.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Hesaplar Kartı */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-transform duration-300 hover:scale-105 flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Hesaplarım</h2>
                        <p className="text-gray-600 mb-4">Mevcut hesaplarınızı görüntüleyin ve yönetin.</p>
                    </div>
                    <a href="#/accounts" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 text-center mt-4">
                        Hesapları Görüntüle
                    </a>
                </div>

                {/* Yeni Hesap Oluştur Kartı */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-transform duration-300 hover:scale-105 flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Yeni Hesap Oluştur</h2>
                        <p className="text-gray-600 mb-4">Yeni bir banka hesabı açın ve finansal yolculuğunuza başlayın.</p>
                    </div>
                    <a href="#/accounts/create" className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 text-center mt-4">
                        Hesap Oluştur
                    </a>
                </div>

                {/* İşlem Geçmişi Kartı */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-transform duration-300 hover:scale-105 flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">İşlem Geçmişi</h2>
                        <p className="text-gray-600 mb-4">Tüm hesaplarınızdaki işlem geçmişini detaylı olarak görüntüleyin.</p>
                    </div>
                    <a href="#/transactions" className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 text-center mt-4">
                        Geçmişi Görüntüle
                    </a>
                </div>

                {/* Para Transferi Kartı (Eğer TransferMoney bileşeniniz varsa) */}
                {/*
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-transform duration-300 hover:scale-105 flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Para Transferi</h2>
                        <p className="text-gray-600 mb-4">Hesaplarınız arasında veya başka hesaplara kolayca para transferi yapın.</p>
                    </div>
                    <a href="#/transfer" className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 text-center mt-4">
                        Transfer Yap
                    </a>
                </div>
                */}
            </div>
        </div>
    );
};

export default Dashboard;
