import express, { Application } from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import routes from './routes/index';
import { config } from './config/config';
import { errorHandler } from './middleware/errorHandler';

//! Express App
const app: Application = express();
const server = http.createServer(app); // Create HTTP server

//! Socket.io Server
const io: SocketIOServer = new SocketIOServer(server, {
    cors: {
        origin: ["http://localhost:5173/", "https://sidekik.netlify.app/"],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }
});

//! Socket.io Logic
let users: any[] = [];

const addUser = (userData: any, socketId: string) => {
    const userIndex = users.findIndex(user => user._id === userData._id);
    if (userIndex !== -1) {
        // Update the user's socket ID if they already exist
        users[userIndex].socketId = socketId;
    } else {
        // Add the user if they don't already exist
        users.push({ ...userData, socketId });
    }
    io.emit("getUsers", users);
};

const removeUser = (socketId: string) => {
    users = users.filter(user => user.socketId !== socketId);
    io.emit("getUsers", users);
};

const getUser = (userId: string) => {
    return users.find(user => user._id === userId);
};

io.on('connection', (socket: Socket) => {
    socket.on("addUsers", (userData) => {
        addUser(userData, socket.id);
    });

    socket.on('sendMessage', (data) => {
        const user = getUser(data.receiverId);
        if (user) {
            io.to(user.socketId).emit('getMessage', data);
        }
    });

    socket.on('disconnect', () => {
        removeUser(socket.id);
    });
});

//! Express Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

//! Routes
app.use('/api', routes);

//! Global Error Handler
app.use(errorHandler);

//! MongoDB Connection
mongoose.connect(config.mongo.url)
    .then(() => {
        server.listen(config.server.port, () => { // Changed app.listen to server.listen
            console.log(`Server is running on port ${config.server.port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
