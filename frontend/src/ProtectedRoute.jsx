import React from 'react';
import { useAuth } from './auth/AuthContext'; // AuthContext'ten useAuth hook'unu import et

// ProtectedRoute bileşeni: Sadece kimlik doğrulanmış kullanıcıların erişimine izin verir
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth(); // Kimlik doğrulama durumu ve yükleme durumu

    if (loading) {
        // Kimlik doğrulama durumu yüklenirken bir yükleme mesajı göster
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-lg font-semibold text-gray-700">Yükleniyor...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Kimlik doğrulanmamışsa, giriş sayfasına yönlendir
        // Hash tabanlı yönlendirme kullandığımız için window.location.hash kullanıyoruz
        window.location.hash = '#/login';
        return null; // Yönlendirme yapıldığı için hiçbir şey render etme
    }

    return children; // Kimlik doğrulanmışsa, çocuk bileşenleri render et
};

export default ProtectedRoute;
