import './Logo.css'

function Logo() {
    return (
        <div className="top-logo">
            <div className="logo-content">
                <svg width="50" height="50" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="url(#gradientLogoApp)" />
                    <path d="M15 12L25 20L15 28V12Z" fill="white" />
                    <defs>
                        <linearGradient id="gradientLogoApp" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#A760FF" />
                            <stop offset="1" stopColor="#FF6BA9" />
                        </linearGradient>
                    </defs>
                </svg>
                <h1 className="logo-title">
                    Toque<span className="logo-plus-span">+</span>
                </h1>
            </div>
            <p className="logo-subtitle">Plataforma de Educação Musical</p>
        </div>
    )
}

export default Logo
