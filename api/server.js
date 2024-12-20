import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { errorMiddleware } from './middleware/error-middleware.js';
// import path from 'path';
import { createServer } from 'http'


// route
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

import { initializeSocket } from "./socket/socket.server.js";


dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// const __dirname = path.resolve();

initializeSocket(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
    // allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/messages", messageRoutes);

app.use(errorMiddleware);

// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, "/client/dist")));

//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname,  "client", "dist", "index.html"));
//     });
// }

// httpServer.listen(PORT, () => {
//     console.log('server started at this port: ' + PORT);
// });
connectDB();
export default app;
