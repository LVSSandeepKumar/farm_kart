import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import logger from './utils/logger.js';
import userRoutes from './routes/user_route.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());


app.use("/api/users", userRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Farm Kart API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
