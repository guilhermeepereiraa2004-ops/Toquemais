import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📦 MongoDB Conectado!');
    } catch (error) {
        console.error('❌ Erro na conexão MongoDB:', error.message);
        process.exit(1);
    }
};

export default connectDB;
