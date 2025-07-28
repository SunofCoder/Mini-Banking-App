import React, { useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        // 5 saniye sonra bildirimi otomatik olarak kapat
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer); // Bileşen kaldırıldığında zamanlayıcıyı temizle
    }, [onClose]);

    const notificationClasses = {
        success: 'bg-green-100 border-green-400 text-green-700',
        error: 'bg-red-100 border-red-400 text-red-700',
        info: 'bg-blue-100 border-blue-400 text-blue-700',
    };

    return (
        <div
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg border ${notificationClasses[type]} flex items-center justify-between z-50 animate-fade-in-up`}
            role="alert"
        >
            <span className="block sm:inline mr-4">{message}</span>
            <button
                onClick={onClose}
                className="text-lg font-bold leading-none text-gray-700 hover:text-gray-900 focus:outline-none"
            >
                &times;
            </button>
        </div>
    );
};

export default Notification;
