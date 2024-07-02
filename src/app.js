import dotenv from 'dotenv';
import express from 'express';
import userRoutes from '../src/routes/user.js';
import apartmentRoutes from '../src/routes/appartment.js'
import connectDB from './config/db.js';

dotenv.config();


const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use the user routes
app.use('/api/users', userRoutes);
app.use('/api/apartments', apartmentRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});