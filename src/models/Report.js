import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
    id: { type: Number, default: () => Date.now() },
    studentId: { type: String, required: true },
    studentName: { type: String },
    date: { type: String },
    topic: { type: String },
    performance: { type: String },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Report', ReportSchema);
