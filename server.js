import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper para Banco de Dados JSON Local
const DB_FILE = path.join(__dirname, 'data', 'database.json');

// Garante que o arquivo existe
if (!fs.existsSync(DB_FILE)) {
    fs.ensureDirSync(path.join(__dirname, 'data'));
    fs.writeJsonSync(DB_FILE, { students: [], contents: [], reports: [] });
}

// Funções de Leitura e Escrita
const readDb = async () => {
    try {
        return await fs.readJson(DB_FILE);
    } catch (error) {
        return { students: [], contents: [], reports: [] };
    }
};

const writeDb = async (data) => {
    await fs.writeJson(DB_FILE, data, { spaces: 2 });
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CONFIGURAÇÃO DE UPLOAD LOCAL ---
const uploadDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadDir);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static(uploadDir));

// --- ROTAS GENÉRICAS DE DADOS ---
app.get('/api/data', async (req, res) => {
    try {
        const db = await readDb();
        res.json({
            students: db.students,
            contents: db.contents,
            reports: db.reports,
            activities: [],
            activity_results: []
        });
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        res.status(500).json({ error: 'Erro ao buscar dados' });
    }
});

app.post('/api/data', async (req, res) => {
    try {
        const db = await readDb();
        const { students, contents, reports } = req.body;

        if (students) db.students = students;
        if (contents) db.contents = contents;
        if (reports) db.reports = reports;

        await writeDb(db);
        res.json({ success: true });
    } catch (error) {
        console.error("Erro ao salvar dados em lote:", error);
        res.status(500).json({ error: 'Erro ao salvar dados' });
    }
});

// --- ROTA DE UPLOAD ---
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        const recipients = req.body.recipients ? JSON.parse(req.body.recipients) : [];

        const newContent = {
            id: Date.now(),
            title: req.body.title || req.file.originalname,
            desc: '',
            recipients: recipients,
            date: new Date().toLocaleDateString('pt-BR'),
            link: '',
            fileUrl: fileUrl,
            fileName: req.file.filename,
            fileType: req.file.mimetype,
            size: req.file.size,
            type: req.body.type || 'material'
        };

        const db = await readDb();
        db.contents.unshift(newContent); // Adiciona no início
        await writeDb(db);

        res.json({ success: true, content: newContent, url: fileUrl });
    } catch (error) {
        console.error("Erro no upload:", error);
        res.status(500).json({ error: 'Erro ao fazer upload do arquivo.' });
    }
});

// --- ROTAS DE CRUD ALUNOS ---
app.post('/api/students', async (req, res) => {
    try {
        const db = await readDb();
        const newStudent = { ...req.body, id: Date.now() }; // Garante ID

        // Check duplicata email
        if (db.students.find(s => s.email === newStudent.email)) {
            return res.status(400).json({ error: 'E-mail já cadastrado.' });
        }

        db.students.push(newStudent);
        await writeDb(db);

        res.json({ success: true, student: newStudent });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar aluno' });
    }
});

app.put('/api/students/:id', async (req, res) => {
    try {
        const db = await readDb();
        const id = Number(req.params.id);
        const index = db.students.findIndex(s => s.id === id);

        if (index === -1) return res.status(404).json({ error: 'Aluno não encontrado' });

        db.students[index] = { ...db.students[index], ...req.body };
        await writeDb(db);

        res.json({ success: true, student: db.students[index] });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar aluno' });
    }
});

app.delete('/api/students/:id', async (req, res) => {
    try {
        const db = await readDb();
        const id = Number(req.params.id);
        db.students = db.students.filter(s => s.id !== id);
        await writeDb(db);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }) }
});

// --- ROTAS CONTEÚDO DELETE ---
app.delete('/api/content/:id', async (req, res) => {
    try {
        const db = await readDb();
        const id = Number(req.params.id);
        const content = db.contents.find(c => c.id === id);

        if (content) {
            if (content.fileName) {
                const filePath = path.join(uploadDir, content.fileName);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            db.contents = db.contents.filter(c => c.id !== id);
            await writeDb(db);
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'Conteúdo não encontrado.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar' });
    }
});

// START
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`\n🚀 SERVIDOR ONLINE NA PORTA ${PORT}!`);
        console.log(`📂 Uploads em: ${uploadDir}`);
        console.log(`💾 Banco de Dados: ${DB_FILE}`);
    });
}

export default app;
