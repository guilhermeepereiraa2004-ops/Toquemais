import { useState, useEffect } from 'react'
import './StudentDashboard.css'

function StudentDashboard() {
    const [studentData] = useState({
        name: 'João Silva',
        level: 'intermediate',
        nextPayment: '2025-01-15',
        progress: 65
    })

    const [contents, setContents] = useState([])
    const [videos, setVideos] = useState([])
    const [materials, setMaterials] = useState([])
    const API_URL = "http://localhost:3001"

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/api/data`)
                const data = await response.json()
                if (data.contents) {
                    setContents(data.contents)

                    // Filter videos
                    const vids = data.contents.filter(c =>
                        (c.type && c.type.toLowerCase().includes('video')) ||
                        (c.fileType && c.fileType.startsWith('video'))
                    )
                    setVideos(vids)

                    // Filter materials (everything else)
                    const mats = data.contents.filter(c =>
                        !((c.type && c.type.toLowerCase().includes('video')) ||
                            (c.fileType && c.fileType.startsWith('video')))
                    )
                    setMaterials(mats)
                }
            } catch (error) {
                console.error("Erro ao buscar dados:", error)
            }
        }
        fetchData()
    }, [])

    const getLevelBadge = (level) => {
        const badges = {
            beginner: 'badge-beginner',
            intermediate: 'badge-intermediate',
            advanced: 'badge-advanced',
            master: 'badge-master'
        }
        return badges[level] || 'badge-beginner'
    }

    const getLevelText = (level) => {
        const texts = {
            beginner: 'Iniciante',
            intermediate: 'Intermediário',
            advanced: 'Avançado',
            master: 'Master'
        }
        return texts[level] || 'Iniciante'
    }

    const openContent = (content) => {
        if (content.fileUrl) {
            window.open(`${API_URL}${content.fileUrl}`, '_blank')
        } else if (content.link) {
            window.open(content.link, '_blank')
        }
    }

    return (
        <div className="student-dashboard">
            <div className="container">
                {/* Header */}
                <div className="dashboard-header">
                    <div className="welcome-section">
                        <h1>Olá, {studentData.name}!</h1>
                        <p>Continue sua jornada musical</p>
                    </div>
                    <div className="header-actions">
                        <span className={`badge ${getLevelBadge(studentData.level)}`}>
                            {getLevelText(studentData.level)}
                        </span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card card">
                        <div className="stat-icon" style={{ background: 'var(--gradient-primary)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 6L16 12L8 18V6Z" fill="white" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{videos.length}</div>
                            <div className="stat-label">Aulas Disponíveis</div>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon" style={{ background: 'var(--gradient-secondary)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" />
                                <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">12h</div>
                            <div className="stat-label">Tempo de Estudo</div>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon" style={{ background: 'var(--gradient-accent)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 11L12 14L22 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M21 12V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H16" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{studentData.progress}%</div>
                            <div className="stat-label">Progresso</div>
                        </div>
                    </div>

                    <div className="stat-card card payment-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FFD560, #FFB060)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="6" width="20" height="12" rx="2" stroke="white" strokeWidth="2" />
                                <path d="M2 10H22" stroke="white" strokeWidth="2" />
                            </svg>
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{new Date(studentData.nextPayment).toLocaleDateString('pt-BR')}</div>
                            <div className="stat-label">Próximo Pagamento</div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="dashboard-content">
                    {/* Video Lessons */}
                    <section className="content-section">
                        <div className="section-header-dash">
                            <h2>Suas Aulas</h2>
                            <a href="#" className="view-all">Ver Todas →</a>
                        </div>

                        {videos.length === 0 ? (
                            <p>Nenhuma aula disponível no momento.</p>
                        ) : (
                            <div className="video-grid">
                                {videos.map(video => (
                                    <div key={video.id} className="video-card card" onClick={() => openContent(video)} style={{ cursor: 'pointer' }}>
                                        <div className="video-thumbnail">
                                            <div className="thumbnail-placeholder">
                                                {video.fileType && video.fileType.startsWith('image') ? (
                                                    <img src={`${API_URL}${video.fileUrl}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="24" cy="24" r="24" fill="url(#vidGrad)" />
                                                        <path d="M19 16L31 24L19 32V16Z" fill="white" />
                                                        <defs>
                                                            <linearGradient id="vidGrad" x1="0" y1="0" x2="48" y2="48">
                                                                <stop stopColor="#A760FF" />
                                                                <stop offset="1" stopColor="#FF6BA9" />
                                                            </linearGradient>
                                                        </defs>
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="video-duration">{video.duration || '00:00'}</span>
                                        </div>
                                        <div className="video-info">
                                            <h3>{video.title}</h3>
                                            <div className="video-meta">
                                                <span className="video-category">{video.desc || 'Videoaula'}</span>
                                                <span className={`badge ${getLevelBadge(video.level || 'intermediate')}`}>
                                                    {getLevelText(video.level || 'intermediate')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Materials */}
                    <section className="content-section">
                        <div className="section-header-dash">
                            <h2>Materiais Didáticos</h2>
                            <a href="#" className="view-all">Ver Todos →</a>
                        </div>

                        <div className="materials-list">
                            {materials.map(material => (
                                <div key={material.id} className="material-item card">
                                    <div className="material-icon">
                                        {((material.fileType && material.fileType.includes('pdf')) || (material.type && material.type.includes('PDF'))) ? (
                                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="32" height="32" rx="6" fill="#FF6B6B" />
                                                <text x="16" y="21" fontSize="12" fill="white" textAnchor="middle" fontWeight="bold">PDF</text>
                                            </svg>
                                        ) : (
                                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="32" height="32" rx="6" fill="#FF9F43" />
                                                <text x="16" y="21" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">DOC</text>
                                            </svg>
                                        )}
                                    </div>
                                    <div className="material-info">
                                        <h4>{material.title}</h4>
                                        <span className="material-size">{material.size ? (material.size / 1024 / 1024).toFixed(1) + ' MB' : ''}</span>
                                    </div>
                                    <button className="btn-download" onClick={() => openContent(material)}>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 3V13M10 13L6 9M10 13L14 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M3 17H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Study Schedule */}
                    <section className="content-section">
                        <div className="section-header-dash">
                            <h2>Agenda de Estudos</h2>
                        </div>

                        <div className="schedule-list">
                            <div className="schedule-item card">
                                <div className="schedule-date">
                                    <div className="date-day">15</div>
                                    <div className="date-month">Jan</div>
                                </div>
                                <div className="schedule-info">
                                    <h4>Prática de Escalas Pentatônicas</h4>
                                    <p>Revisar exercícios 1-5 da apostila</p>
                                </div>
                                <span className="schedule-status status-pending">Pendente</span>
                            </div>

                            <div className="schedule-item card">
                                <div className="schedule-date">
                                    <div className="date-day">18</div>
                                    <div className="date-month">Jan</div>
                                </div>
                                <div className="schedule-info">
                                    <h4>Teoria: Modos Gregos</h4>
                                    <p>Assistir aula e fazer anotações</p>
                                </div>
                                <span className="schedule-status status-upcoming">Em Breve</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default StudentDashboard
