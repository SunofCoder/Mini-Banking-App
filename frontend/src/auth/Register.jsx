import React, { useState } from 'react';
import { useAuth } from './AuthContext'; // AuthContext'ten useAuth hook'unu import et
import Notification from '../components/Notification'; // Bildirim bileşenini import et

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, loading } = useAuth(); // AuthContext'ten register ve loading durumlarını al
    const [notification, setNotification] = useState(null); // Bildirim state'i

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNotification(null); // Önceki bildirimi temizle
        const result = await register(username, email, password);
        if (result.success) {
            setNotification({ message: 'Kayıt başarılı! Lütfen giriş yapın.', type: 'success' });
            setUsername('');
            setEmail('');
            setPassword('');
            setTimeout(() => {
                window.location.hash = '#/login'; // 1.5 saniye sonra giriş sayfasına yönlendir
            }, 1500);
        } else {
            setNotification({ message: result.message, type: 'error' });
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Kayıt Ol</h2>

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
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            E-posta
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            placeholder="E-posta adresinizi girin"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        {loading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
                    </button>
                </form>

                <p className="text-center text-gray-600 text-sm mt-6">
                    Zaten hesabınız var mı?{' '}
                    <a href="#/login" className="text-blue-600 hover:underline font-medium">
                        Buradan giriş yapın
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
