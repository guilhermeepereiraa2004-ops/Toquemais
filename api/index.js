import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import mongoose from 'mongoose';
import connectDB from '../src/config/database.js';
import { initFirebase, uploadFileToFirebase, deleteFileFromFirebase } from '../src/services/firebaseStorage.js';

// Models
import Student from '../src/models/Student.js';
import Content from '../src/models/Content.js';
import Report from '../src/models/Report.js';

dotenv.config();

// Inicializações
const app = express();
// Vercel Serverless não usa porta fixa, mas para dev local:
const PORT = process.env.PORT || 3001;

// Conexões (Executa a cada requisição fria no serverless)
connectDB();
// initFirebase(); // Desabilitado temporariamente para isolar erro 500

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de Upload (Memória para Vercel/Firebase)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// --- ROTA DE DIAGNÓSTICO (Para debugar no Vercel) ---
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        env_bucket: !!process.env.FIREBASE_BUCKET_URL
    });
});

// --- ROTA PRINCIPAL: DADOS AGREGADOS ---
// --- ROTA PRINCIPAL: DADOS AGREGADOS ---
app.get('/api/data', async (req, res) => {
    // Fail-safe: Se não tiver conectado ao banco ainda
    if (mongoose.connection.readyState !== 1) {
        await connectDB(); // Tenta conectar de novo
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                error: 'Banco de dados não conectado. Verifique MONGODB_URI.',
                students: [], // Retorna array vazio para não quebrar o frontend
                contents: [],
                reports: []
            });
        }
    }

    try {
        const [students, contents, reports] = await Promise.all([
            Student.find().sort({ name: 1 }),
            Content.find().sort({ createdAt: -1 }),
            Report.find().sort({ createdAt: -1 })
        ]);

        res.json({
            students,
            contents,
            reports,
            activities: [],
            activity_results: []
        });
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        res.status(500).json({ error: 'Erro ao buscar dados do servidor: ' + error.message });
    }
});

// --- ROTAS ALUNOS ---
app.post('/api/students', async (req, res) => {
    try {
        const { email } = req.body;
        const exists = await Student.findOne({ email });
        if (exists) return res.status(400).json({ error: 'E-mail já cadastrado.' });

        const newStudent = await Student.create(req.body);
        res.json(newStudent);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar aluno.' });
    }
});

app.put('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Student.findOneAndUpdate({ $or: [{ id: id }, { _id: id }] }, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/students/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Student.findOneAndDelete({ $or: [{ id: id }, { _id: id }] });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- ROTAS CONTEÚDO (UPLOAD) ---
app.post('/api/content', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            const newContent = await Content.create({
                ...req.body,
                recipients: req.body.recipients
            });
            return res.json({ success: true, content: newContent });
        }

        try {
            const fileData = await uploadFileToFirebase(req.file);
            const newContent = await Content.create({
                ...req.body,
                recipients: req.body.recipients,
                fileUrl: fileData.url,
                fileName: fileData.fileName,
                fileType: req.file.mimetype,
                size: req.file.size
            });
            return res.json({ success: true, content: newContent });
        } catch (fbError) {
            console.error("Erro no Firebase:", fbError);
            return res.status(500).json({ error: 'Erro ao fazer upload para nuvem. Verifique credenciais.' });
        }

    } catch (error) {
        console.error("Erro geral upload:", error);
        res.status(500).json({ error: 'Erro interno no upload.' });
    }
});

app.delete('/api/content/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const content = await Content.findOne({ $or: [{ id: id }, { _id: id }] });

        if (content) {
            if (content.fileUrl && content.fileUrl.includes('storage.googleapis.com')) {
                await deleteFileFromFirebase(content.fileName || content.fileUrl).catch(err => console.error("Erro delete FB:", err));
            }
            await Content.deleteOne({ _id: content._id });
        }
        res.json({ success: true });
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
        res.status(500).json({ error: error.message });
    }
});

// Listener local para dev (Vercel ignora isso ao usar import)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando localmente na porta ${PORT}`);
    });
}

export default app;
