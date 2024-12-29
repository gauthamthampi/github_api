import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routers/userRouter';
import connectDB from './config/db';

// Load environment variables
dotenv.config();

// Initialize Express application
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase as needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api', userRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
