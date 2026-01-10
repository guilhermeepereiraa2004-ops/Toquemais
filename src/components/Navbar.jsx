import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-logo">
                        <div className="logo-icon">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="18" fill="url(#gradient1)" />
                                <path d="M15 12L25 20L15 28V12Z" fill="white" />
                                <defs>
                                    <linearGradient id="gradient1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#A760FF" />
                                        <stop offset="1" stopColor="#FF6BA9" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <span className="logo-text">Toque<span className="logo-plus">+</span></span>
                    </Link>

                    <div className="navbar-links">
                        <Link to="/" className="nav-link">Início</Link>
                        <Link to="/login" className="nav-link">Entrar</Link>
                        <Link to="/login" className="btn btn-primary btn-sm">Começar Agora</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
