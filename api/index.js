import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import mongoose from 'mongoose';
import { readFile } from 'node:fs/promises';
import connectDB from '../src/config/database.js';
import { initFirebase, uploadFileToFirebase, deleteFileFromFirebase } from '../src/services/firebaseStorage.js';

// Models
import Student from '../src/models/Student.js';
import Content from '../src/models/Content.js';
import Report from '../src/models/Report.js';
import Activity from '../src/models/Activity.js';
import ActivityResult from '../src/models/ActivityResult.js';
import Goal from '../src/models/Goal.js';

dotenv.config();

// Inicializações
const app = express();
// Vercel Serverless não usa porta fixa, mas para dev local:
const PORT = process.env.PORT || 3001;

// Conexões (Executa a cada requisição fria no serverless)
connectDB().catch((error) => {
    console.warn('MongoDB indisponível na inicialização; a API continuará ativa e tentará novamente nas requisições.', error.message);
});
initFirebase(); // Inicializa se as credenciais existirem


// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de Upload (Memória para Vercel/Firebase)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// --- HELPER PARA QUERY SEGURA POR ID ---
const getSafeQuery = (id) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return { _id: id };
    }
    const numericId = Number(id);
    if (!isNaN(numericId)) {
        return { id: numericId };
    }
    return { id: id }; // Fallback para string literal se não for nenhum dos anteriores
};

const waitForDatabase = () => Promise.race([
    connectDB(),
    new Promise((_, reject) => setTimeout(
        () => reject(new Error('Tempo limite ao conectar ao MongoDB.')),
        6000
    ))
]);

// --- ROTA DE DIAGNÓSTICO (Para debugar no Vercel) ---
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        env_bucket: !!process.env.FIREBASE_BUCKET_URL
    });
});

// --- ROTA DE LOGIN (Email OU Nome + Senha) ---
app.post('/api/login', async (req, res) => {
    try {
        await connectDB();
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ error: 'Preencha todos os campos.' });
        }

        // Buscar por email OU nome (case-insensitive para nome)
        const student = await Student.findOne({
            $or: [
                { email: identifier },
                { name: { $regex: new RegExp(`^${identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }
            ],
            active: true
        });

        if (!student) {
            return res.status(401).json({ error: 'Aluno não encontrado.' });
        }

        if (student.password !== password) {
            return res.status(401).json({ error: 'Senha incorreta.' });
        }

        res.json({
            success: true,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                level: student.level
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno no login.' });
    }
});

// --- ROTA PRINCIPAL: DADOS AGREGADOS ---
app.get('/api/data', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) await waitForDatabase();

        const [students, contents, reports, activities, activity_results, goals] = await Promise.all([
            Student.find().sort({ name: 1 }),
            Content.find().sort({ createdAt: -1 }),
            Report.find().sort({ createdAt: -1 }),
            Activity.find().sort({ createdAt: -1 }),
            ActivityResult.find().sort({ createdAt: -1 }),
            Goal.find({ active: true }).sort({ createdAt: -1 })
        ]);

        res.json({
            students,
            contents,
            reports,
            activities,
            activity_results,
            goals
        });
    } catch (error) {
        console.error("Erro ao buscar dados:", error);

        // No desenvolvimento local, mantém o painel utilizável mesmo quando
        // o MongoDB remoto estiver temporariamente inacessível.
        if (process.env.NODE_ENV !== 'production') {
            try {
                const localData = JSON.parse(await readFile(new URL('../data/database.json', import.meta.url), 'utf8'));
                return res.json({
                    students: localData.students || [],
                    contents: localData.contents || [],
                    reports: localData.reports || [],
                    activities: localData.activities || [],
                    activity_results: localData.activity_results || [],
                    goals: localData.goals || [],
                    source: 'local-fallback'
                });
            } catch (fallbackError) {
                console.error('Erro ao carregar dados locais:', fallbackError.message);
            }
        }

        res.status(503).json({
            error: 'Banco de dados indisponível. Verifique a conexão e a variável MONGODB_URI.',
            students: [],
            contents: [],
            reports: [],
            activities: [],
            activity_results: [],
            goals: []
        });
    }
});

// --- ROTAS ALUNOS ---
app.post('/api/students', async (req, res) => {
    try {
        await connectDB();
        const { email, name } = req.body;

        // Se tem email, verifica duplicidade por email
        if (email && email.trim()) {
            const existsByEmail = await Student.findOne({ email });
            if (existsByEmail) return res.status(400).json({ error: 'E-mail já cadastrado.' });
        } else {
            // Se não tem email, remove do body para não salvar string vazia
            delete req.body.email;
        }

        // Verifica se já existe aluno com o mesmo nome (para evitar duplicatas de login por nome)
        const existsByName = await Student.findOne({ name: { $regex: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });
        if (existsByName) return res.status(400).json({ error: 'Já existe um aluno cadastrado com esse nome.' });

        const newStudent = await Student.create(req.body);
        res.json(newStudent);
    } catch (error) {
        console.error('Erro ao criar aluno:', error);
        res.status(500).json({ error: 'Erro ao criar aluno: ' + error.message });
    }
});

app.put('/api/students/:id', async (req, res) => {
    try {
        await connectDB();
        const { id } = req.params;
        const updated = await Student.findOneAndUpdate(getSafeQuery(id), req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Student.findOneAndDelete(getSafeQuery(id));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- ROTAS CONTEÚDO (UPLOAD) ---
app.post('/api/content', upload.single('file'), async (req, res) => {
    try {
        await connectDB();

        // Garantir que recipients seja salva corretamente (se vier stringificada)
        let recipients = req.body.recipients;
        if (typeof recipients === 'string') {
            try { recipients = JSON.parse(recipients); } catch (e) { recipients = [recipients]; }
        }

        const contentData = {
            title: req.body.title,
            desc: req.body.desc,
            type: req.body.type || 'material',
            link: req.body.link || '',
            recipients: recipients,
            date: req.body.date || new Date().toLocaleDateString('pt-BR')
        };

        if (!req.file) {
            const newContent = await Content.create(contentData);
            return res.json({ success: true, content: newContent });
        }

        try {
            const fileData = await uploadFileToFirebase(req.file);
            const newContent = await Content.create({
                ...contentData,
                fileUrl: fileData.url,
                fileName: fileData.fileName,
                fileType: req.file.mimetype,
                size: req.file.size
            });
            return res.json({ success: true, content: newContent });
        } catch (fbError) {
            console.error("Erro no Firebase:", fbError);
            return res.status(500).json({ error: 'Erro ao fazer upload para nuvem. Verifique FIREBASE_SERVICE_ACCOUNT.' });
        }

    } catch (error) {
        console.error("Erro geral upload:", error);
        res.status(500).json({ error: 'Erro interno no upload: ' + error.message });
    }
});

app.delete('/api/content/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = getSafeQuery(id);
        const content = await Content.findOne(query);

        if (content) {
            // 1. Deletar arquivo do Firebase se existir
            if (content.fileUrl && content.fileUrl.includes('storage.googleapis.com')) {
                await deleteFileFromFirebase(content.fileName || content.fileUrl).catch(err => console.error("Erro delete FB:", err));
            }

            // 2. Remover o conteúdo de qualquer lista vinculada em alunos (se existir)
            const contentIdStr = content.id ? content.id.toString() : content._id.toString();
            await Student.updateMany(
                { contents: contentIdStr },
                { $pull: { contents: contentIdStr } }
            ).catch(err => console.error("Erro ao limpar aluno:", err));

            // 3. Deletar o documento principal
            await Content.deleteOne({ _id: content._id });
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/content/:id', async (req, res) => {
    try {
        await connectDB();
        const { id } = req.params;
        const updated = await Content.findOneAndUpdate(getSafeQuery(id), req.body, { new: true });
        res.json({ success: true, content: updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- ROTAS RELATÓRIOS ---
app.post('/api/reports', async (req, res) => {
    try {
        const newReport = await Report.create(req.body);
        res.json(newReport);
    } catch (error) {
        console.error("Erro ao salvar report:", error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/reports/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Report.findOneAndDelete(getSafeQuery(id));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- ROTAS RESULTADOS DE ATIVIDADES ---
app.post('/api/activity_results', async (req, res) => {
    try {
        await connectDB(); // Garantir conexão ativa antes de operar
        const newResult = await ActivityResult.create(req.body);
        res.json(newResult);
    } catch (error) {
        console.error("Erro ao salvar resultado:", error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/activity_results/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await ActivityResult.findOneAndDelete({ _id: id });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- ROTAS ATIVIDADES ---
app.post('/api/activities', async (req, res) => {
    try {
        await connectDB(); // Garantir conexão ativa antes de operar
        const newActivity = await Activity.create(req.body);
        res.json(newActivity);
    } catch (error) {
        console.error("Erro activity:", error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/activities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let query = {};

        if (mongoose.Types.ObjectId.isValid(id)) {
            query = { _id: id };
        } else {
            const numericId = Number(id);
            if (!isNaN(numericId)) {
                query = { id: numericId };
            } else {
                // Se não for nem ObjectId nem numérico, tenta buscar atividades antigas ou retorna erro
                // Mas geralmente activities antigas usavam ID numérico.
                // Se chegar aqui com string inválida, melhor retornar erro 400.
                return res.status(400).json({ error: "ID inválido fornecido." });
            }
        }

        const deleted = await Activity.findOneAndDelete(query);

        if (!deleted) {
            return res.status(404).json({ error: "Atividade não encontrada para remoção." });
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Erro ao deletar atividade:", error);
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/activities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let query = {};

        // Verificação segura para construir a query
        if (mongoose.Types.ObjectId.isValid(id)) {
            query = { _id: id };
        } else {
            // Tenta converter para número se for numérico
            const numericId = Number(id);
            if (!isNaN(numericId)) {
                query = { id: numericId };
            } else {
                // Fallback para string se não for número nem ObjectId válido
                // (Isso evita CastError se 'id' no schema fosse String, mas aqui é Number, então cuidado)
                return res.status(400).json({ error: "ID inválido fornecido." });
            }
        }

        console.log(`[PUT Activity] ID: ${id}, Body:`, req.body); // Log request

        const updatedActivity = await Activity.findOneAndUpdate(
            query,
            { $set: req.body }, // Use $set to ensure we only update provided fields
            { new: true, runValidators: true } // Run validators (e.g. check for string array)
        );

        if (!updatedActivity) {
            return res.status(404).json({ error: "Atividade não encontrada." });
        }

        res.json(updatedActivity);
    } catch (error) {
        console.error("Erro ao atualizar atividade:", error);
        res.status(500).json({ error: error.message });
    }
});

// --- ROTAS METAS ---
app.post('/api/goals', async (req, res) => {
    try {
        await connectDB();
        const { studentId, studentName, description, type } = req.body;
        if (!studentId || !description) {
            return res.status(400).json({ error: 'Aluno e descrição são obrigatórios.' });
        }
        const goal = await Goal.create({ studentId, studentName, description, type: type || 'daily' });
        res.json(goal);
    } catch (error) {
        console.error('Erro ao criar meta:', error);
        res.status(500).json({ error: 'Erro ao criar meta.' });
    }
});

app.delete('/api/goals/:id', async (req, res) => {
    try {
        await connectDB();
        const query = getSafeQuery(req.params.id);
        await Goal.findOneAndDelete(query);
        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao deletar meta:', error);
        res.status(500).json({ error: 'Erro ao deletar meta.' });
    }
});

// Marcar/desmarcar meta como cumprida para uma data
app.post('/api/goals/:id/toggle', async (req, res) => {
    try {
        await connectDB();
        const query = getSafeQuery(req.params.id);
        const { date } = req.body; // formato YYYY-MM-DD
        if (!date) return res.status(400).json({ error: 'Data é obrigatória.' });

        const goal = await Goal.findOne(query);
        if (!goal) return res.status(404).json({ error: 'Meta não encontrada.' });

        const idx = goal.completions.indexOf(date);
        if (idx >= 0) {
            goal.completions.splice(idx, 1); // Desmarcar
        } else {
            goal.completions.push(date); // Marcar
        }
        await goal.save();
        res.json(goal);
    } catch (error) {
        console.error('Erro ao atualizar meta:', error);
        res.status(500).json({ error: 'Erro ao atualizar meta.' });
    }
});

// Listener local para dev (Vercel ignora isso ao usar import)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando localmente na porta ${PORT}`);
    });
}

export default app;
