import React, { createContext, useContext, useState, useEffect } from 'react';

// AuthContext'i oluşturuyoruz.
const AuthContext = createContext();

// AuthProvider bileşeni, tüm uygulamanın kimlik doğrulama durumunu sağlar.
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Giriş yapmış kullanıcı bilgisi
    const [token, setToken] = useState(localStorage.getItem('jwtToken') || null); // JWT token'ı
    const [loading, setLoading] = useState(true); // Başlangıç yükleme durumu

    // Uygulama yüklendiğinde localStorage'da token olup olmadığını kontrol et.
    useEffect(() => {
        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                setUser({ username: decodedToken.sub });
            } catch (e) {
                console.error("Geçersiz token formatı:", e);
                setToken(null);
                localStorage.removeItem('jwtToken');
            }
        }
        setLoading(false); // Yükleme tamamlandı
    }, [token]);

    // Kullanıcı giriş fonksiyonu
    const login = async (username, password) => {
        try {
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Giriş başarısız oldu');
            }

            const data = await response.json();
            setToken(data.accessToken);
            localStorage.setItem('jwtToken', data.accessToken);
            setUser({ username: username });
            return { success: true };
        } catch (error) {
            console.error('Giriş hatası:', error);
            return { success: false, message: error.message };
        }
    };

    // Kullanıcı kayıt fonksiyonu
    const register = async (username, email, password) => {
        try {
            const response = await fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Kayıt başarısız oldu');
            }

            return { success: true };
        } catch (error) {
            console.error('Kayıt hatası:', error);
            return { success: false, message: error.message };
        }
    };

    // Kullanıcı çıkış fonksiyonu
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('jwtToken');
    };

    // Context değeri
    const authContextValue = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
    };

    // AuthProvider her zaman AuthContext.Provider'ı render etmeli
    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// AuthContext'i kullanmak için özel hook
export const useAuth = () => useContext(AuthContext);
