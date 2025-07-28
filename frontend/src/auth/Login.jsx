import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import Notification from '../components/Notification'; // Notification bileşenini import et

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, error: authError, loading } = useAuth(); // 'error' adını 'authError' olarak değiştirdik

    const [notification, setNotification] = useState(null); // Bildirim state'i

    // AuthContext'ten gelen hatayı notification olarak göster
    useEffect(() => {
        if (authError) {
            setNotification({ message: authError, type: 'error' });
        }
    }, [authError]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification(null); // Önceki bildirimi temizle
        const result = await login(username, password);
        if (!result.success) {
            // Hata zaten AuthContext'te ayarlanıyor, burada tekrar ayarlamaya gerek yok
            // setNotification({ message: result.message, type: 'error' });
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Giriş Yap</h2>

                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                            Kullanıcı Adı
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            placeholder="Kullanıcı adınızı girin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Şifre
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            placeholder="Şifrenizi girin"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                    </button>
                </form>

                <p className="text-center text-gray-600 text-sm mt-6">
                    Hesabınız yok mu?{' '}
                    <a href="#/register" className="text-blue-600 hover:underline font-medium">
                        Buradan kayıt olun
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
