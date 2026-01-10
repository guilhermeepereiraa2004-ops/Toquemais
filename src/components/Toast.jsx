import { useEffect } from 'react';
import './Toast.css';

// Hook para usar toast em componentes React
export const useToast = () => {
    const show = (message, type = 'info', duration = 4000) => {
        if (typeof window !== 'undefined' && window.toast) {
            window.toast.show(message, type, duration);
        }
    };

    return {
        success: (message, duration) => show(message, 'success', duration),
        error: (message, duration) => show(message, 'error', duration),
        warning: (message, duration) => show(message, 'warning', duration),
        info: (message, duration) => show(message, 'info', duration),
    };
};

// Componente Toast Container para React
export const ToastContainer = () => {
    useEffect(() => {
        // Importa o script de toast se ainda não existir
        if (typeof window !== 'undefined' && !window.toast) {
            import('../utils/toast.js').then(module => {
                window.toast = module.default;
            });
        }
    }, []);

    return null; // O container é criado pelo toast.js
};

export default useToast;
