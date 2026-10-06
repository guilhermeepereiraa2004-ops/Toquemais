import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-logo">
                        <div className="logo-icon">
                            <img src="/logo-mark.svg" alt="" aria-hidden="true" />
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
