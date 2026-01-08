import mongoose from 'mongoose';

const ActivityResultSchema = new mongoose.Schema({
    student: { type: String, required: true }, // Nome do aluno (simples)
    studentId: { type: String }, // ID opcional para linkar
    activityId: { type: String, required: true },
    activityTitle: { type: String, required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    date: { type: String, required: true },
    detailedAnswers: [{
        question: String,
        userAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean
    }],
    createdAt: { type: Date, default: Date.now }
});

const ActivityResult = mongoose.model('ActivityResult', ActivityResultSchema);
export default ActivityResult;
