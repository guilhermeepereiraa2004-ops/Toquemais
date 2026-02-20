import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
    id: { type: String, default: () => Date.now().toString() },
    name: { type: String, required: true },
    email: { type: String, sparse: true, unique: true, default: null }, // Opcional: alunos pequenos podem não ter email
    password: { type: String, required: true },
    cpf: { type: String },
    phone: { type: String },
    nextPayment: { type: String }, // Alterado para String para aceitar data "YYYY-MM-DD"
    payment: { type: String }, // Dia do vencimento (1-31)
    paymentStatus: { type: String, default: 'aguardando' }, // Status: isento, em_dia, em_atraso, aguardando
    level: { type: String, default: 'beginner' }, // Removido enum estrito para evitar erros de validação
    studyTopic: { type: String },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Student', StudentSchema);
