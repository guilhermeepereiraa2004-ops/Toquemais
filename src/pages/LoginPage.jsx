import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

function LoginPage() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
        userType: 'student'
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const API_URL = "http://localhost:3001"

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (formData.userType === 'admin') {
            // Admin login - mantém simulação
            navigate('/admin')
            return
        }

        // Login do aluno via API (por nome OU email)
        setLoading(true)
        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identifier: formData.identifier.trim(),
                    password: formData.password
                })
            })

            const data = await response.json()

            if (response.ok && data.success) {
                // Salvar dados do aluno logado
                localStorage.setItem('loggedStudent', JSON.stringify(data.student))
                navigate('/student')
            } else {
                setError(data.error || 'Erro ao fazer login.')
            }
        } catch (err) {
            console.error('Erro de conexão:', err)
            setError('Erro de conexão com o servidor.')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError('')
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
                            <h2>Bem-vindo de Volta!</h2>
                            <p>Entre para continuar seus estudos</p>
                        </div>

                        {error && (
                            <div className="login-error">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
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

                            <div className="form-group">
                                <label className="form-label" htmlFor="identifier">
                                    {formData.userType === 'student' ? 'Nome ou E-mail' : 'Email'}
                                </label>
                                <input
                                    type="text"
                                    id="identifier"
                                    name="identifier"
                                    className="form-input"
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    required
                                    placeholder={formData.userType === 'student' ? 'Seu nome ou e-mail' : 'admin@email.com'}
                                    autoComplete="username"
                                />
                                {formData.userType === 'student' && (
                                    <small className="form-hint">
                                        💡 Alunos podem entrar usando o nome ou e-mail cadastrado
                                    </small>
                                )}
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
                                    autoComplete="current-password"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={loading}
                            >
                                {loading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </form>
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

