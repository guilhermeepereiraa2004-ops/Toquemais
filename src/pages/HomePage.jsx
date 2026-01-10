import './HomePage.css'

function HomePage() {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-background">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                    <div className="gradient-orb orb-3"></div>
                </div>

                <div className="container">
                    <div className="hero-content animate-fade-in">
                        <h1 className="hero-title">
                            Aprenda Música com os<br />
                            <span className="text-gradient">Melhores Professores</span>
                        </h1>
                        <p className="hero-subtitle">
                            Plataforma completa de educação musical com vídeos, materiais didáticos,
                            acompanhamento personalizado e muito mais.
                        </p>
                        <div className="hero-buttons">
                            <a href="/login" className="btn btn-primary btn-lg">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.66667 5L11.6667 10L6.66667 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Começar Agora
                            </a>
                            <a href="#features" className="btn btn-outline btn-lg">
                                Saiba Mais
                            </a>
                        </div>

                        <div className="hero-stats">
                            <div className="stat-item">
                                <div className="stat-number">500+</div>
                                <div className="stat-label">Alunos Ativos</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">1000+</div>
                                <div className="stat-label">Vídeo Aulas</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">98%</div>
                                <div className="stat-label">Satisfação</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="section features">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="animate-fade-in">Recursos da Plataforma</h2>
                        <p className="animate-fade-in">Tudo que você precisa para evoluir na música</p>
                    </div>

                    <div className="grid grid-3">
                        <div className="card card-glass animate-fade-in">
                            <div className="feature-icon">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="48" height="48" rx="12" fill="url(#grad1)" />
                                    <path d="M18 16L30 24L18 32V16Z" fill="white" />
                                    <defs>
                                        <linearGradient id="grad1" x1="0" y1="0" x2="48" y2="48">
                                            <stop stopColor="#A760FF" />
                                            <stop offset="1" stopColor="#FF6BA9" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <h3>Vídeo Aulas HD</h3>
                            <p>Acesse centenas de vídeo aulas em alta qualidade, organizadas por nível e instrumento.</p>
                        </div>

                        <div className="card card-glass animate-fade-in">
                            <div className="feature-icon">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="48" height="48" rx="12" fill="url(#grad2)" />
                                    <path d="M14 18H34M14 24H34M14 30H26" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                    <defs>
                                        <linearGradient id="grad2" x1="0" y1="0" x2="48" y2="48">
                                            <stop stopColor="#60D5FF" />
                                            <stop offset="1" stopColor="#A760FF" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <h3>Material Didático</h3>
                            <p>PDFs, apresentações e partituras para complementar seus estudos.</p>
                        </div>

                        <div className="card card-glass animate-fade-in">
                            <div className="feature-icon">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="48" height="48" rx="12" fill="url(#grad3)" />
                                    <circle cx="24" cy="24" r="8" stroke="white" strokeWidth="3" />
                                    <path d="M24 16V12M24 36V32M32 24H36M12 24H16" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                    <defs>
                                        <linearGradient id="grad3" x1="0" y1="0" x2="48" y2="48">
                                            <stop stopColor="#FFB060" />
                                            <stop offset="1" stopColor="#FF6BA9" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <h3>Acompanhamento Personalizado</h3>
                            <p>Receba notificações sobre novos conteúdos e lembretes de pagamento.</p>
                        </div>

                        <div className="card card-glass animate-fade-in">
                            <div className="feature-icon">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="48" height="48" rx="12" fill="url(#grad4)" />
                                    <path d="M16 28L22 22L26 26L32 20" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    <defs>
                                        <linearGradient id="grad4" x1="0" y1="0" x2="48" y2="48">
                                            <stop stopColor="#60FFB0" />
                                            <stop offset="1" stopColor="#60D5FF" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <h3>Níveis de Progresso</h3>
                            <p>Evolua do Iniciante ao Master com conteúdo adaptado ao seu nível.</p>
                        </div>

                        <div className="card card-glass animate-fade-in">
                            <div className="feature-icon">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="48" height="48" rx="12" fill="url(#grad5)" />
                                    <rect x="14" y="14" width="20" height="20" rx="2" stroke="white" strokeWidth="3" />
                                    <path d="M20 14V10M28 14V10M14 22H34" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                    <defs>
                                        <linearGradient id="grad5" x1="0" y1="0" x2="48" y2="48">
                                            <stop stopColor="#FF60D5" />
                                            <stop offset="1" stopColor="#A760FF" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <h3>Agenda de Estudos</h3>
                            <p>Organize seus estudos com datas e tópicos personalizados.</p>
                        </div>

                        <div className="card card-glass animate-fade-in">
                            <div className="feature-icon">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="48" height="48" rx="12" fill="url(#grad6)" />
                                    <rect x="12" y="16" width="24" height="16" rx="2" stroke="white" strokeWidth="3" />
                                    <circle cx="18" cy="24" r="2" fill="white" />
                                    <circle cx="30" cy="24" r="2" fill="white" />
                                    <defs>
                                        <linearGradient id="grad6" x1="0" y1="0" x2="48" y2="48">
                                            <stop stopColor="#FFD560" />
                                            <stop offset="1" stopColor="#FFB060" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <h3>Acesso Mobile</h3>
                            <p>Estude onde estiver com nosso aplicativo mobile (em breve).</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Levels Section */}
            <section className="section levels">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="animate-fade-in">Níveis de Aprendizado</h2>
                        <p className="animate-fade-in">Conteúdo adaptado para cada etapa da sua jornada</p>
                    </div>

                    <div className="grid grid-2">
                        <div className="card level-card">
                            <span className="badge badge-beginner">Iniciante</span>
                            <h3>Começando do Zero</h3>
                            <p>Fundamentos da música, teoria básica e primeiros acordes.</p>
                            <ul className="level-features">
                                <li>✓ Teoria musical básica</li>
                                <li>✓ Primeiros acordes e escalas</li>
                                <li>✓ Leitura de cifras</li>
                                <li>✓ Ritmo e tempo</li>
                            </ul>
                        </div>

                        <div className="card level-card">
                            <span className="badge badge-intermediate">Intermediário</span>
                            <h3>Desenvolvendo Técnicas</h3>
                            <p>Aprofunde seus conhecimentos e desenvolva técnicas avançadas.</p>
                            <ul className="level-features">
                                <li>✓ Harmonia intermediária</li>
                                <li>✓ Técnicas de execução</li>
                                <li>✓ Improvisação básica</li>
                                <li>✓ Repertório variado</li>
                            </ul>
                        </div>

                        <div className="card level-card">
                            <span className="badge badge-advanced">Avançado</span>
                            <h3>Refinando Habilidades</h3>
                            <p>Técnicas complexas, improvisação e interpretação profissional.</p>
                            <ul className="level-features">
                                <li>✓ Harmonia avançada</li>
                                <li>✓ Improvisação complexa</li>
                                <li>✓ Arranjos musicais</li>
                                <li>✓ Performance profissional</li>
                            </ul>
                        </div>

                        <div className="card level-card">
                            <span className="badge badge-master">Master</span>
                            <h3>Excelência Musical</h3>
                            <p>Domine completamente seu instrumento e desenvolva seu estilo único.</p>
                            <ul className="level-features">
                                <li>✓ Composição avançada</li>
                                <li>✓ Estilo próprio</li>
                                <li>✓ Masterclasses exclusivas</li>
                                <li>✓ Mentoria individual</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section cta">
                <div className="container">
                    <div className="cta-card card-glass">
                        <h2>Pronto para Começar sua Jornada Musical?</h2>
                        <p>Junte-se a centenas de alunos que já estão transformando sua relação com a música.</p>
                        <a href="/login" className="btn btn-primary btn-lg">
                            Criar Minha Conta Agora
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomePage
