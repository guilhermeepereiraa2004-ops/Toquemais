import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
    completions: [{ type: String }], // Array de datas (YYYY-MM-DD) em que a meta foi cumprida
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Goal || mongoose.model('Goal', goalSchema);
