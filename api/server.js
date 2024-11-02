import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// route
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { connectDB } from './config/db.js';
import { errorMiddleware } from './middleware/error-middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/matches", matchRoutes);
// app.use("/api/messages", messageRoutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log('server started at this port: ' + PORT);
    connectDB();
});