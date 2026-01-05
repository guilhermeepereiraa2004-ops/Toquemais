import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
    id: { type: String, default: () => Date.now().toString() },
    student: { type: String, required: true }, // Nome do aluno
    studentId: { type: String }, // ID opcional para relacionar
    feedback: { type: String, required: true },
    date: { type: String, default: () => new Date().toLocaleDateString('pt-BR') },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Report', ReportSchema);
