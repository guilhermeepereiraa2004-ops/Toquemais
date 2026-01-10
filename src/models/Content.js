import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
    id: { type: Number, default: () => Date.now() },
    title: { type: String, required: true },
    desc: { type: String },
    recipients: [{ type: String }],
    date: { type: String, default: () => new Date().toLocaleDateString('pt-BR') },
    link: { type: String }, // Mantendo legado
    fileUrl: { type: String }, // Nova URL local
    fileName: { type: String },
    fileType: { type: String },
    size: { type: Number },
    type: { type: String, default: 'material' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Content', ContentSchema);
