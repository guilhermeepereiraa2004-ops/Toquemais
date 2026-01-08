import { useState, useEffect } from 'react'
import { useToast } from '../context/ToastContext'
import './AdminDashboard.css'

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('students')
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [showAddStudentModal, setShowAddStudentModal] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [showReportModal, setShowReportModal] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [showScheduleModal, setShowScheduleModal] = useState(false)

    const [students, setStudents] = useState([])
    const [contents, setContents] = useState([])
    const [reports, setReports] = useState([])
    const [activities, setActivities] = useState([])
    const [selectedActivity, setSelectedActivity] = useState(null)
    const [showActivityModal, setShowActivityModal] = useState(false)
    const [editingContent, setEditingContent] = useState(null)
    const [selectedRecipients, setSelectedRecipients] = useState(['all'])
    const API_URL = "http://localhost:3001"

    const fetchData = async () => {
        try {
            const response = await fetch(`${API_URL}/api/data`)
            const data = await response.json()
            setStudents(data.students || [])
            setContents(data.contents || [])
            setReports(data.reports || [])
            setActivities(data.activities || [])
        } catch (err) {
            console.error("Servidor offline", err)
        }
    }

    useEffect(() => {
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

    const handleViewProfile = (student) => {
        setSelectedStudent(student)
    }

    const handleUpdateSchedule = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)

        const updates = {
            nextLesson: formData.get('topic'),
            nextLessonDate: formData.get('date'),
            nextPayment: formData.get('payment') // Also allowing payment date update here if exists in form
        }

        try {
            const response = await fetch(`${API_URL}/api/students/${selectedStudent.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            if (response.ok) {
                const data = await response.json();

                // Update local list
                setStudents(prev => prev.map(s => s.id === selectedStudent.id ? data.student : s));
                // Update selected student view
                setSelectedStudent(data.student);

                addToast('Plano de aula atualizado!', 'success');
                setShowScheduleModal(false);
            } else {
                addToast('Erro ao atualizar plano.', 'error');
            }
        } catch (error) {
            console.error(error);
            addToast('Erro de conexão.', 'error');
        }
    }

    const compressFile = async (file) => {
        if (file.type.startsWith('image/')) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (e) => {
                    const img = new Image();
                    img.src = e.target.result;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        let width = img.width;
                        let height = img.height;
                        const max = 1200;
                        if (width > height && width > max) { height *= max / width; width = max; }
                        else if (height > max) { width *= max / height; height = max; }
                        canvas.width = width;
                        canvas.height = height;
                        ctx.drawImage(img, 0, 0, width, height);
                        resolve({ data: canvas.toDataURL('image/jpeg', 0.7), name: file.name, type: 'image/jpeg' });
                    };
                };
            });
        }
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => resolve({ data: e.target.result, name: file.name, type: file.type });
        });
    }

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const fileInput = e.target.querySelector('input[type="file"]');
        const file = fileInput?.files[0];
        const title = formData.get('title');
        const recipients = selectedRecipients;

        const btn = e.target.querySelector('button[type="submit"]');
        btn.innerText = "Salvando...";
        btn.disabled = true;

        try {
            if (editingContent && !file) {
                // Just updating metadata
                const updatedContent = {
                    ...editingContent,
                    title,
                    recipients,
                    type: formData.get('type')
                };

                const response = await fetch(`${API_URL}/api/data`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        students,
                        reports,
                        contents: contents.map(c => c.id === editingContent.id ? updatedContent : c)
                    })
                });

                if (response.ok) {
                    setContents(prev => prev.map(c => c.id === editingContent.id ? updatedContent : c));
                    addToast('Conteúdo atualizado com sucesso!', 'success');
                    setShowUploadModal(false);
                    setEditingContent(null);
                }
            } else {
                // New upload or replacing file
                if (file && file.size > 3 * 1024 * 1024 * 1024) return alert('Limite de 3GB excedido.');

                const uploadData = new FormData();
                if (file) uploadData.append('file', file);
                uploadData.append('title', title);
                uploadData.append('type', formData.get('type'));
                uploadData.append('recipients', JSON.stringify(recipients));

                const response = await fetch(`${API_URL}/api/upload`, {
                    method: 'POST',
                    body: uploadData
                });

                if (response.ok) {
                    const result = await response.json();
                    if (editingContent) {
                        setContents(prev => prev.map(c => c.id === editingContent.id ? result.content : c));
                        // Delete old file if needed (server side should handle cleanup if we implement it, 
                        // but for now let's just update the list)
                    } else {
                        setContents(prev => [result.content, ...prev]);
                    }
                    addToast('Salvo no sistema com sucesso!', 'success');
                    setShowUploadModal(false);
                    setEditingContent(null);
                }
            }
        } catch (err) {
            addToast('Erro ao conectar com o servidor local.', 'error');
            console.error(err);
        } finally {
            btn.innerText = editingContent ? "Atualizar Conteúdo" : "Salvar Conteúdo";
            btn.disabled = false;
        }
    }

    const handleDeleteContent = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este conteúdo?')) return;

        try {
            const response = await fetch(`${API_URL}/api/content/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setContents(prev => prev.filter(c => c.id !== id));
                addToast('Conteúdo excluído!', 'success');
            }
        } catch (err) {
            addToast('Erro ao excluir conteúdo.', 'error');
        }
    }

    const handleAssignActivity = async (e) => {
        e.preventDefault();
        const activityId = selectedActivity.id;
        const recipients = selectedRecipients;

        try {
            const response = await fetch(`${API_URL}/api/activities/${activityId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipients })
            });

            if (response.ok) {
                const updatedActivity = await response.json();
                setActivities(prev => prev.map(a => a.id === activityId ? updatedActivity : a));
                addToast('Atividade atribuída com sucesso!', 'success');
                setShowActivityModal(false);
            }
        } catch (err) {
            console.error(err);
            addToast('Erro ao atribuir atividade.', 'error');
        }
    }


    const handleEditContent = (content) => {
        setEditingContent(content);
        setSelectedRecipients(content.recipients || ['all']);
        setShowUploadModal(true);
    }


    const { addToast } = useToast()

    const handleAddStudent = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)

        const newStudent = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('pass'),
            level: formData.get('level'),
            nextPayment: formData.get('payment'),
            status: 'active',
            nextLesson: 'A definir'
        }

        try {
            const response = await fetch(`${API_URL}/api/students`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStudent)
            });

            const data = await response.json();

            if (response.ok) {
                setStudents([...students, data.student]);
                setShowAddStudentModal(false);
                addToast('Aluno cadastrado com sucesso!', 'success');
            } else {
                addToast(data.error || 'Erro ao cadastrar aluno', 'error');
            }
        } catch (error) {
            console.error(error);
            addToast('Erro de conexão ao cadastrar aluno', 'error');
        }
    }

    const handleSaveReport = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const newReport = {
            id: reports.length + 1,
            studentId: selectedStudent.id,
            date: new Date().toISOString().split('T')[0],
            feedback: formData.get('feedback'),
            improvement: formData.get('improvement')
        }
        setReports([...reports, newReport])
        setShowReportModal(false)
        addToast('Relatório de progresso salvo!', 'success')
    }

    const sendPaymentReminder = (student) => {
        addToast(`Lembrete de pagamento enviado para ${student.name} (${student.email})`, 'info')
    }

    return (
        <div className="admin-dashboard">
            <div className="container-wide">
                {/* Header */}
                <div className="admin-header">
                    <div className="welcome-section">
                        <h1>Painel Administrativo</h1>
                        <p>Gestão completa de alunos e conteúdos</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-secondary" onClick={() => setShowAddStudentModal(true)}>
                            Novo Aluno
                        </button>
                        <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
                            Novo Conteúdo
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="admin-tabs">
                    <button className={`tab-button ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>Alunos</button>
                    <button className={`tab-button ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>Conteúdos</button>
                    <button className={`tab-button ${activeTab === 'activities' ? 'active' : ''}`} onClick={() => setActiveTab('activities')}>Atividades</button>
                    <button className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>Relatórios</button>
                    <button className={`tab-button ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => setActiveTab('finance')}>Financeiro</button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'students' && (
                        <div className="students-section">
                            {selectedStudent ? (
                                <div className="student-profile-view">
                                    <button className="btn btn-outline btn-sm" onClick={() => setSelectedStudent(null)} style={{ marginBottom: '1rem' }}>Voltar à Lista</button>
                                    <div className="card profile-card">
                                        <div className="profile-header">
                                            <div className="student-avatar-large">{selectedStudent.name.charAt(0)}</div>
                                            <div className="profile-info">
                                                <h2>{selectedStudent.name}</h2>
                                                <p>{selectedStudent.email}</p>
                                                <span className={`badge ${getLevelBadge(selectedStudent.level)}`}>{getLevelText(selectedStudent.level)}</span>
                                            </div>
                                            <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
                                                <button className="btn btn-outline btn-sm" onClick={() => setShowPasswordModal(true)}>Alterar Senha</button>
                                                <button className="btn btn-primary btn-sm" onClick={() => setShowReportModal(true)}>Novo Relatório</button>
                                            </div>
                                        </div>

                                        <div className="profile-details-grid">
                                            <div className="detail-section">
                                                <h3>Aula e Agenda</h3>
                                                <div className="info-box card">
                                                    <p><strong>Assunto:</strong> {selectedStudent.nextLesson}</p>
                                                    <p><strong>Data:</strong> {new Date(selectedStudent.nextLessonDate).toLocaleDateString('pt-BR')}</p>
                                                    <button className="btn btn-secondary btn-sm" onClick={() => setShowScheduleModal(true)} style={{ marginTop: '1rem' }}>Editar Plano</button>
                                                </div>
                                            </div>
                                            <div className="detail-section">
                                                <h3>Histórico de Evolução</h3>
                                                <div className="reports-mini-list">
                                                    {reports.filter(r => r.studentId === selectedStudent.id).map(r => (
                                                        <div key={r.id} className="report-item card">
                                                            <span>{new Date(r.date).toLocaleDateString('pt-BR')}</span>
                                                            <p>{r.feedback}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="students-table card">
                                    <table>
                                        <thead>
                                            <tr><th>Nome</th><th>Nível</th><th>Ações</th></tr>
                                        </thead>
                                        <tbody>
                                            {students.map(student => (
                                                <tr key={student.id}>
                                                    <td><div className="student-name"><div className="student-avatar">{student.name.charAt(0)}</div>{student.name}</div></td>
                                                    <td><span className={`badge ${getLevelBadge(student.level)}`}>{getLevelText(student.level)}</span></td>
                                                    <td><button className="btn btn-outline btn-sm" onClick={() => handleViewProfile(student)}>Gerenciar</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'finance' && (
                        <div className="finance-section">
                            <h2>Gestão de Pagamentos</h2>
                            <div className="finance-list card">
                                {students.map(student => (
                                    <div key={student.id} className="finance-item">
                                        <div className="student-info">
                                            <strong>{student.name}</strong>
                                            <span>Vencimento: {new Date(student.nextPayment).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                        <div className="finance-status">
                                            <span className={`status-badge ${student.status === 'active' ? 'status-active' : 'status-pending'}`}>
                                                {student.status === 'active' ? 'Em dia' : 'Vencido'}
                                            </span>
                                            <button className="btn btn-outline btn-sm" onClick={() => sendPaymentReminder(student)}>Lembrar Pagamento</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div className="reports-section">
                            <h2>Relatórios de Progresso</h2>
                            <div className="reports-grid">
                                {reports.map(report => {
                                    const student = students.find(s => s.id === report.studentId)
                                    return (
                                        <div key={report.id} className="report-detail-card card">
                                            <div className="report-header">
                                                <strong>{student?.name}</strong>
                                                <span>{new Date(report.date).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            <div className="report-body">
                                                <p><strong>Evolução:</strong> {report.feedback}</p>
                                                <p><strong>Onde melhorar:</strong> {report.improvement}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === 'content' && (
                        <div className="content-section-admin">
                            <div className="content-grid">
                                {contents.map(content => (
                                    <div key={content.id} className="content-card card">
                                        <div className="content-preview">
                                            {content.fileType?.startsWith('image/') ? (
                                                <img src={`${API_URL}${content.fileUrl}`} alt={content.title} />
                                            ) : content.fileType?.startsWith('video/') ? (
                                                <video src={`${API_URL}${content.fileUrl}`} muted />
                                            ) : (
                                                <div className="file-icon-placeholder">
                                                    {content.fileType?.includes('pdf') ? '📄 PDF' : '📁 DOC'}
                                                </div>
                                            )}
                                            <div className="content-type">{content.fileType?.split('/')[1]?.toUpperCase() || 'FILE'}</div>
                                        </div>
                                        <div className="content-body">
                                            <h3>{content.title}</h3>
                                            <p className="recipients-badge">
                                                {content.recipients?.includes('all') ? 'Todos os alunos' : `${content.recipients?.length} Aluno(s) específico(s)`}
                                            </p>
                                            <div className="content-actions">
                                                <button className="btn btn-outline btn-sm" onClick={() => handleEditContent(content)}>Editar</button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteContent(content.id)}>Excluir</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'activities' && (
                        <div className="content-section-admin">
                            <h2>Gestão de Atividades</h2>
                            <div className="content-grid">
                                {activities.map(activity => (
                                    <div key={activity.id} className="content-card card" onClick={() => {
                                        setSelectedActivity(activity);
                                        setSelectedRecipients(activity.recipients || []);
                                        setShowActivityModal(true);
                                    }} style={{ cursor: 'pointer' }}>
                                        <div className="content-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>
                                            <span style={{ fontSize: '3rem' }}>📝</span>
                                        </div>
                                        <div className="content-body">
                                            <h3>{activity.title}</h3>
                                            <p className="recipients-badge">
                                                {activity.recipients?.includes('all') ? 'Todos os alunos' : `${activity.recipients?.length || 0} Aluno(s)`}
                                            </p>
                                            <div className="content-actions">
                                                <button className="btn btn-outline btn-sm">Ver Detalhes / Atribuir</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showAddStudentModal && (
                <div className="modal-overlay" onClick={() => setShowAddStudentModal(false)}>
                    <div className="modal-content card" onClick={e => e.stopPropagation()}>
                        <h2>Cadastrar Novo Aluno</h2>
                        <form className="upload-form" onSubmit={handleAddStudent}>
                            <div className="form-group"><label>Nome Completo</label><input name="name" className="form-input" required /></div>
                            <div className="form-group"><label>E-mail</label><input name="email" type="email" className="form-input" required /></div>
                            <div className="form-group">
                                <label>Nível</label>
                                <select name="level" className="form-select">
                                    <option value="beginner">Iniciante</option>
                                    <option value="intermediate">Intermediário</option>
                                    <option value="advanced">Avançado</option>
                                    <option value="master">Master</option>
                                </select>
                            </div>
                            <div className="form-group"><label>Data de Pagamento</label><input name="payment" type="date" className="form-input" required /></div>
                            <div className="form-group"><label>Senha Provisória</label><input type="password" name="pass" className="form-input" required /></div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowAddStudentModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Criar Conta</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showUploadModal && (
                <div className="modal-overlay" onClick={() => { setShowUploadModal(false); setEditingContent(null); setSelectedRecipients(['all']); }}>
                    <div className="modal-content card" onClick={e => e.stopPropagation()}>
                        <h2>{editingContent ? 'Editar Conteúdo' : 'Upload de Conteúdo'}</h2>
                        <form className="upload-form" onSubmit={handleUpload}>
                            <div className="form-group">
                                <label>Tipo</label>
                                <select name="type" className="form-select" defaultValue={editingContent?.type || "Material de Apoio"}>
                                    <option>Vídeo (Auto-Compressão)</option>
                                    <option>PDF</option>
                                    <option>Imagem</option>
                                    <option>Material de Apoio</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Título</label>
                                <input name="title" className="form-input" required defaultValue={editingContent?.title} />
                            </div>
                            <div className="form-group">
                                <label>Arquivo {editingContent && '(Opcional se não quiser trocar)'}</label>
                                <input type="file" className="form-input" />
                                <small style={{ color: 'var(--text-muted)' }}>Limite de 3GB. Arquivos grandes serão processados.</small>
                            </div>

                            <div className="form-group">
                                <label>Quem pode ver?</label>
                                <div className="recipients-selection card">
                                    <label className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            checked={selectedRecipients.includes('all')}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedRecipients(['all']);
                                                else setSelectedRecipients([]);
                                            }}
                                        />
                                        <span>Todos os alunos</span>
                                    </label>
                                    <div className="students-selection-list">
                                        {students.map(student => (
                                            <label key={student.id} className="checkbox-item">
                                                <input
                                                    type="checkbox"
                                                    disabled={selectedRecipients.includes('all')}
                                                    checked={selectedRecipients.includes(student.id.toString())}
                                                    onChange={(e) => {
                                                        const idStr = student.id.toString();
                                                        if (e.target.checked) {
                                                            setSelectedRecipients(prev => [...prev.filter(r => r !== 'all'), idStr]);
                                                        } else {
                                                            setSelectedRecipients(prev => prev.filter(r => r !== idStr));
                                                        }
                                                    }}
                                                />
                                                <span>{student.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => { setShowUploadModal(false); setEditingContent(null); }}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">{editingContent ? 'Salvar Alterações' : 'Fazer Upload'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showPasswordModal && (
                <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
                    <div className="modal-content card" onClick={e => e.stopPropagation()}>
                        <h2>Redefinir Senha - {selectedStudent?.name}</h2>
                        <form className="upload-form" onSubmit={(e) => { e.preventDefault(); addToast('Senha alterada!', 'success'); setShowPasswordModal(false); }}>
                            <div className="form-group"><label>Nova Senha</label><input type="password" name="newpass" className="form-input" required /></div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowPasswordModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Salvar Senha</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showScheduleModal && (
                <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
                    <div className="modal-content card" onClick={e => e.stopPropagation()}>
                        <h2>Editar Plano de Aula - {selectedStudent?.name}</h2>
                        <form className="upload-form" onSubmit={handleUpdateSchedule}>
                            <div className="form-group">
                                <label>Próximo Tópico/Assunto</label>
                                <input name="topic" className="form-input" required defaultValue={selectedStudent?.nextLesson} />
                            </div>
                            <div className="form-group">
                                <label>Data da Aula</label>
                                <input name="date" type="date" className="form-input" required defaultValue={selectedStudent?.nextLessonDate} />
                            </div>
                            <div className="form-group">
                                <label>Próximo Pagamento</label>
                                <input name="payment" type="date" className="form-input" defaultValue={selectedStudent?.nextPayment} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowScheduleModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Salvar Alterações</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showReportModal && (
                <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
                    <div className="modal-content card" onClick={e => e.stopPropagation()}>
                        <h2>Novo Relatório de Progresso</h2>
                        <form className="upload-form" onSubmit={handleSaveReport}>
                            <div className="form-group"><label>Como foi a evolução?</label><textarea name="feedback" className="form-textarea" required></textarea></div>
                            <div className="form-group"><label>O que precisa melhorar?</label><textarea name="improvement" className="form-textarea" required></textarea></div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowReportModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Salvar Relatório</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showActivityModal && selectedActivity && (
                <div className="modal-overlay" onClick={() => setShowActivityModal(false)}>
                    <div className="modal-content card" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2>{selectedActivity.title}</h2>
                            <button className="btn btn-sm btn-outline" onClick={() => setShowActivityModal(false)}>X</button>
                        </div>

                        <div className="activity-details" style={{ maxHeight: '60vh', overflowY: 'auto', marginBottom: '1rem' }}>
                            <h3>Questões e Respostas</h3>
                            {selectedActivity.questions.map((q, idx) => (
                                <div key={idx} className="question-item" style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
                                    <p><strong>{idx + 1}. {q.text}</strong></p>
                                    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                                        <li style={{ color: q.correct === 'a' ? 'var(--success)' : 'inherit', fontWeight: q.correct === 'a' ? 'bold' : 'normal' }}>A) {q.a} {q.correct === 'a' && '✅'}</li>
                                        <li style={{ color: q.correct === 'b' ? 'var(--success)' : 'inherit', fontWeight: q.correct === 'b' ? 'bold' : 'normal' }}>B) {q.b} {q.correct === 'b' && '✅'}</li>
                                        <li style={{ color: q.correct === 'c' ? 'var(--success)' : 'inherit', fontWeight: q.correct === 'c' ? 'bold' : 'normal' }}>C) {q.c} {q.correct === 'c' && '✅'}</li>
                                        <li style={{ color: q.correct === 'd' ? 'var(--success)' : 'inherit', fontWeight: q.correct === 'd' ? 'bold' : 'normal' }}>D) {q.d} {q.correct === 'd' && '✅'}</li>
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleAssignActivity} className="upload-form">
                            <h3>Atribuir aos Alunos</h3>
                            <div className="recipients-selection card">
                                <label className="checkbox-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedRecipients.includes('all')}
                                        onChange={(e) => {
                                            if (e.target.checked) setSelectedRecipients(['all']);
                                            else setSelectedRecipients([]);
                                        }}
                                    />
                                    <span>Todos os alunos</span>
                                </label>
                                <div className="students-selection-list">
                                    {students.map(student => (
                                        <label key={student.id} className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                disabled={selectedRecipients.includes('all')}
                                                checked={selectedRecipients.includes(student.id.toString())}
                                                onChange={(e) => {
                                                    const idStr = student.id.toString();
                                                    if (e.target.checked) {
                                                        setSelectedRecipients(prev => [...prev.filter(r => r !== 'all'), idStr]);
                                                    } else {
                                                        setSelectedRecipients(prev => prev.filter(r => r !== idStr));
                                                    }
                                                }}
                                            />
                                            <span>{student.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowActivityModal(false)}>Fechar</button>
                                <button type="submit" className="btn btn-primary">Salvar Atribuição</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDashboard
