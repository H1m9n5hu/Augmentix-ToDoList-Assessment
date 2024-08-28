import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongo_url = process.env.MONGO_CONN;

mongoose.connect(mongo_url)
    .than(() => {
        console.log('Connected to MongoDB');
    }).catch(() => {
        console.log('Failed to connect to MongoDB', error);
    })