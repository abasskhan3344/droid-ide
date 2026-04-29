import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import fileRoutes from './routes/files';
import projectRoutes from './routes/projects';
import { setupTerminalWS } from './websocket/terminal.ws';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/files', fileRoutes);
app.use('/api/projects', projectRoutes);

wss.on('connection', (ws, req) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  if (url.pathname === '/ws/terminal') {
    setupTerminalWS(ws);
  }
});

server.listen(port, () => {
  console.log(`Full-stack Android IDE backend listening on port ${port}`);
});