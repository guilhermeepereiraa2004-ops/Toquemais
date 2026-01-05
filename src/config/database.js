import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📦 MongoDB Conectado!');
    } catch (error) {
        console.error('❌ Erro na conexão MongoDB:', error.message);
        // Não derrubar o processo no serverless para não retornar 502/500 genérico.
        // process.exit(1); 
    }
};

export default connectDB;
