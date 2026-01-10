# Toque+ 🎵
## Plataforma de Educação Musical

Uma plataforma moderna e completa para professores de música gerenciarem seus alunos, conteúdos e acompanhamento pedagógico.

---

## 📋 Sobre o Projeto

**Toque+** é uma plataforma web desenvolvida especialmente para professores de música que desejam:
- Gerenciar alunos e suas credenciais de acesso
- Compartilhar vídeo aulas e materiais didáticos
- Acompanhar o progresso dos alunos
- Enviar notificações e lembretes
- Organizar conteúdo por níveis de habilidade

---

## ✨ Funcionalidades Principais

### Para o Professor (Administrador)
- ✅ **Gerenciamento de Alunos**
  - Criar contas para novos alunos
  - Definir níveis (Iniciante, Intermediário, Avançado, Master)
  - Configurar datas de pagamento
  - Editar informações dos alunos

- ✅ **Biblioteca de Conteúdos**
  - Upload de vídeo aulas (até 1GB com compressão)
  - Upload de materiais didáticos (PDF, PPTX)
  - Organização por nível e categoria
  - Links externos para recursos adicionais

- ✅ **Sistema de Notificações**
  - Notificações de novos conteúdos
  - Lembretes de pagamento
  - Mensagens personalizadas
  - Envio para grupos específicos (por nível)

- ✅ **Agenda de Estudos**
  - Criar cronogramas personalizados
  - Definir tópicos e datas
  - Acompanhar conclusão de tarefas

### Para os Alunos
- ✅ **Acesso ao Conteúdo**
  - Visualizar vídeo aulas organizadas por nível
  - Download de materiais didáticos
  - Acesso a links e recursos externos

- ✅ **Acompanhamento**
  - Ver progresso pessoal
  - Agenda de estudos personalizada
  - Notificações de novos conteúdos
  - Lembretes de pagamento

- ✅ **Dashboard Personalizado**
  - Estatísticas de estudo
  - Aulas concluídas
  - Próximos pagamentos

---

## 🚀 Como Usar

### Abertura do Projeto
1. Navegue até a pasta do projeto: `c:\Users\usuário\Documents\Projeto das aulas`
2. Abra o arquivo `index.html` em qualquer navegador moderno (Chrome, Firefox, Edge, Safari)

### Primeiro Acesso (Professor)
1. Na página inicial, clique em **"Acessar Plataforma"**
2. Selecione **"Professor/Administrador"** no tipo de usuário
3. Faça login com suas credenciais
4. Acesse o painel administrativo para começar a adicionar alunos e conteúdos

### Acesso dos Alunos
1. Os alunos devem solicitar credenciais ao professor
2. O professor cria a conta do aluno no painel administrativo
3. O aluno recebe email e senha para acessar a plataforma
4. Na página de login, o aluno seleciona **"Aluno"** e entra com suas credenciais

---

## 🎨 Design e Tecnologias

### Design System
- **Cores Principais**: Gradientes vibrantes (roxo, rosa, azul)
- **Tema**: Dark mode moderno
- **Efeitos**: Glassmorphism, animações suaves, micro-interações
- **Tipografia**: Inter (corpo) e Outfit (títulos)
- **Responsividade**: Totalmente adaptável para mobile, tablet e desktop

### Tecnologias Utilizadas
- **HTML5**: Estrutura semântica
- **CSS3**: Design system completo com variáveis CSS
- **JavaScript**: Interatividade e navegação entre páginas
- **Google Fonts**: Tipografia moderna

---

## 📱 Níveis de Habilidade

A plataforma suporta 4 níveis de aprendizado:

1. **🟢 Iniciante** - Fundamentos e primeiros passos
2. **🟡 Intermediário** - Desenvolvimento de técnicas
3. **🟠 Avançado** - Refinamento e técnicas complexas
4. **🟣 Master** - Excelência e estilo próprio

---

## 🔐 Sistema de Autenticação

**IMPORTANTE**: Apenas o professor pode criar contas de alunos.

- Os alunos **NÃO** podem se auto-registrar
- Todas as contas são criadas pelo administrador
- Credenciais são fornecidas diretamente aos alunos
- Recuperação de senha deve ser solicitada ao professor

---

## 📂 Estrutura de Arquivos

```
Projeto das aulas/
├── index.html          # Página principal (HTML standalone)
├── styles.css          # Estilos completos da aplicação
├── app.js              # Lógica JavaScript
├── README.md           # Este arquivo
└── src/                # Arquivos fonte do projeto React (opcional)
    ├── index.css
    ├── main.jsx
    ├── App.jsx
    ├── components/
    │   ├── Navbar.jsx
    │   └── Navbar.css
    └── pages/
        ├── HomePage.jsx
        ├── HomePage.css
        ├── LoginPage.jsx
        ├── LoginPage.css
        ├── StudentDashboard.jsx
        ├── StudentDashboard.css
        ├── AdminDashboard.jsx
        └── AdminDashboard.css
```

---

## 🔄 Próximos Passos (Backend)

Para uma implementação completa em produção, será necessário:

1. **Backend/API**
   - Node.js + Express ou Python + Flask/Django
   - Banco de dados (PostgreSQL, MongoDB)
   - Autenticação JWT
   - Upload de arquivos (AWS S3, Cloudinary)

2. **Funcionalidades Adicionais**
   - Sistema de notificações real (email, push)
   - Compressão automática de vídeos
   - Sistema de pagamentos integrado
   - Analytics e relatórios
   - Chat professor-aluno

3. **Aplicativo Mobile**
   - React Native ou Flutter
   - Sincronização com a plataforma web
   - Notificações push nativas

---

## 🎯 Recursos Visuais

- **Animações**: Fade-in, slide, pulse
- **Hover Effects**: Transformações suaves em cards e botões
- **Gradientes**: Múltiplos gradientes temáticos
- **Glassmorphism**: Efeito de vidro fosco em cards
- **Scrollbar Customizada**: Estilizada com as cores do tema
- **Orbs Flutuantes**: Elementos decorativos animados no background

---

## 📞 Suporte

Para dúvidas ou problemas:
- Entre em contato com o desenvolvedor
- Consulte a documentação inline no código
- Verifique o console do navegador para mensagens de debug

---

## 📄 Licença

Este projeto foi desenvolvido para uso educacional e pode ser adaptado conforme necessário.

---

**Desenvolvido com ❤️ para educadores musicais**

*Versão 1.0 - Dezembro 2025*
