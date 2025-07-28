import React from 'react';
import { useAuth } from '../auth/AuthContext';

const Header = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg rounded-b-lg">
            <nav className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a href="#/" className="text-2xl font-bold tracking-wide hover:text-blue-200 transition duration-300 mb-2 md:mb-0">
                    Mini Banking Uygulaması
                </a>
                <ul className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-6">
                    {isAuthenticated ? (
                        <>
                            <li>
                                <a href="#/dashboard" className="hover:text-blue-200 transition duration-300 text-lg font-medium px-2 py-1 rounded-md">
                                    Gösterge Paneli
                                </a>
                            </li>
                            <li>
                                <button
                                    onClick={logout}
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105 text-lg"
                                >
                                    Çıkış Yap
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <a href="#/login" className="hover:text-blue-200 transition duration-300 text-lg font-medium px-2 py-1 rounded-md">
                                    Giriş Yap
                                </a>
                            </li>
                            <li>
                                <a href="#/register" className="hover:text-blue-200 transition duration-300 text-lg font-medium px-2 py-1 rounded-md">
                                    Kayıt Ol
                                </a>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
