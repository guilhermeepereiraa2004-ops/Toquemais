import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
    id: { type: Number, default: () => Date.now() },
    title: { type: String, required: true },
    date: { type: String, default: () => new Date().toLocaleDateString('pt-BR') },
    recipients: [{ type: String }], // Array de IDs de alunos
    questions: [{
        text: String,
        a: String,
        b: String,
        c: String,
        d: String,
        correct: String // 'a', 'b', 'c', or 'd'
    }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Activity', ActivitySchema);
