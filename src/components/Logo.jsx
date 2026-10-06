import './Logo.css'

function Logo() {
    return (
        <div className="top-logo">
            <div className="logo-content">
                <img className="app-logo-mark" src="/logo-mark.svg" alt="" aria-hidden="true" />
                <h1 className="logo-title">
                    Toque<span className="logo-plus-span">+</span>
                </h1>
            </div>
            <p className="logo-subtitle">Plataforma de Educação Musical</p>
        </div>
    )
}

export default Logo
