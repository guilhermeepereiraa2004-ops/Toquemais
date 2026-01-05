import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

function LoginPage() {
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        userType: 'student'
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        // Simulação de login - em produção, conectar com backend
        if (formData.userType === 'admin') {
            navigate('/admin')
        } else {
            navigate('/student')
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="login-page">
            <div className="login-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
            </div>

            <div className="container">
                <div className="login-container">
                    <div className="login-card card-glass">
                        <div className="login-header">
                            <h2>{isLogin ? 'Bem-vindo de Volta!' : 'Criar Conta'}</h2>
                            <p>{isLogin ? 'Entre para continuar seus estudos' : 'Comece sua jornada musical hoje'}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">
                            {!isLogin && (
                                <div className="form-group">
                                    <label className="form-label" htmlFor="name">Nome Completo</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required={!isLogin}
                                        placeholder="Seu nome"
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label" htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="seu@email.com"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="password">Senha</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="form-input"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="userType">Tipo de Usuário</label>
                                <select
                                    id="userType"
                                    name="userType"
                                    className="form-select"
                                    value={formData.userType}
                                    onChange={handleChange}
                                >
                                    <option value="student">Aluno</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>

                            {isLogin && (
                                <div className="form-footer">
                                    <a href="#" className="forgot-password">Esqueceu a senha?</a>
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary btn-full">
                                {isLogin ? 'Entrar' : 'Criar Conta'}
                            </button>
                        </form>

                        <div className="login-divider">
                            <span>ou</span>
                        </div>

                        <button
                            type="button"
                            className="btn btn-secondary btn-full"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Criar Nova Conta' : 'Já Tenho Conta'}
                        </button>
                    </div>

                    <div className="login-info">
                        <div className="info-card card-glass">
                            <h3>Acesso Total</h3>
                            <p>Centenas de vídeo aulas e materiais didáticos</p>
                        </div>
                        <div className="info-card card-glass">
                            <h3>Estude Onde Quiser</h3>
                            <p>Acesso via web e aplicativo mobile</p>
                        </div>
                        <div className="info-card card-glass">
                            <h3>Acompanhamento</h3>
                            <p>Notificações e lembretes personalizados</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
