import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
    id: { type: String, default: () => Date.now().toString() },
    student: { type: String }, // Nome do aluno (opcional se tiver ID)
    studentId: { type: String, required: true }, // ID agora é obrigatório para garantir integridade
    feedback: { type: String, required: true },
    date: { type: String, default: () => new Date().toLocaleDateString('pt-BR') },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Report', ReportSchema);
