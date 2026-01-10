// Sistema de Toast Notifications
// Tipos: success, error, warning, info

class ToastManager {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        // Cria o container se não existir
        if (!document.getElementById('toast-container')) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.style.cssText = `
                position: fixed;
                top: 100px;
                right: 2rem;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                pointer-events: none;
                max-width: 400px;
            `;
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('toast-container');
        }
    }

    show(message, type = 'info', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';

        const config = this.getConfig(type);

        toast.style.cssText = `
            background: var(--bg-card, #1a1a1f);
            border: 1px solid ${config.borderColor};
            border-left: 4px solid ${config.accentColor};
            padding: 1rem 1.5rem;
            border-radius: 16px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            gap: 1rem;
            min-width: 300px;
            max-width: 400px;
            animation: toastSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: auto;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        toast.innerHTML = `
            <div style="font-size: 1.5rem; flex-shrink: 0;">${config.icon}</div>
            <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 800; font-family: var(--font-display, 'Outfit', sans-serif); font-size: 0.9rem; color: white; margin-bottom: 0.2rem;">${config.title}</div>
                <div style="font-size: 0.85rem; opacity: 0.9; color: var(--text-secondary, #bbb); word-wrap: break-word;">${message}</div>
            </div>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; color: var(--text-secondary, #bbb); cursor: pointer; font-size: 1.2rem; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; opacity: 0.6; transition: opacity 0.2s;">×</button>
        `;

        // Hover effect
        toast.addEventListener('mouseenter', () => {
            toast.style.transform = 'translateX(-5px)';
            toast.style.borderColor = config.accentColor;
        });

        toast.addEventListener('mouseleave', () => {
            toast.style.transform = 'translateX(0)';
            toast.style.borderColor = config.borderColor;
        });

        // Click to dismiss
        toast.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') {
                this.dismiss(toast);
            }
        });

        this.container.appendChild(toast);

        // Auto dismiss
        if (duration > 0) {
            setTimeout(() => this.dismiss(toast), duration);
        }

        return toast;
    }

    dismiss(toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        toast.style.transition = 'all 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }

    getConfig(type) {
        const configs = {
            success: {
                icon: '✅',
                title: 'Sucesso!',
                accentColor: '#60ffb0',
                borderColor: 'rgba(96, 255, 176, 0.2)'
            },
            error: {
                icon: '❌',
                title: 'Erro!',
                accentColor: '#ff6060',
                borderColor: 'rgba(255, 96, 96, 0.2)'
            },
            warning: {
                icon: '⚠️',
                title: 'Atenção!',
                accentColor: '#ffa000',
                borderColor: 'rgba(255, 160, 0, 0.2)'
            },
            info: {
                icon: '💡',
                title: 'Informação',
                accentColor: '#2196f3',
                borderColor: 'rgba(33, 150, 243, 0.2)'
            }
        };

        return configs[type] || configs.info;
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// Adiciona animação CSS ao documento
if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        @keyframes toastSlideIn {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @media (max-width: 768px) {
            #toast-container {
                top: auto !important;
                bottom: 1rem !important;
                right: 1rem !important;
                left: 1rem !important;
                max-width: none !important;
            }

            .toast-notification {
                min-width: auto !important;
                max-width: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Instância global
const toast = new ToastManager();

// Exporta para uso em módulos
export default toast;

// Também disponibiliza globalmente para HTML puro
if (typeof window !== 'undefined') {
    window.toast = toast;
}
