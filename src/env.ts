import dotenv from 'dotenv';
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
export const PROJECT_ID = process.env.PROJECT_ID;
export const API_KEY = process.env.API_KEY;