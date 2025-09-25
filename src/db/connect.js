import mongoose from 'mongoose';
import { config } from '../config/env.js';

export async function connectDB(){
  try {
    if (!config.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }
    
    console.log('[DB] Connecting to MongoDB...');
    console.log('[DB] MongoDB URI:', config.MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // 비밀번호 숨김
    await mongoose.connect(config.MONGODB_URI);
    console.log('[DB] Connected successfully');
    console.log('[DB] Database name:', mongoose.connection.db.databaseName);
    console.log('[DB] Host:', mongoose.connection.host);
    console.log('[DB] Port:', mongoose.connection.port);
    
    // 연결 에러 처리
    mongoose.connection.on('error', (err) => {
      console.error('[DB] Connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('[DB] Disconnected from MongoDB');
    });
    
  } catch (error) {
    console.error('[DB] Connection failed:', error.message);
    throw error;
  }
}
