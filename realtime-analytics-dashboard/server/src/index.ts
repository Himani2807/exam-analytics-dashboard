import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import metricsRouter from './controllers/metricsController';
import { setupSocket } from './sockets';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use('/api/metrics', metricsRouter);

setupSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});