import * as pty from 'node-pty';
import { WebSocket } from 'ws';
import path from 'path';

export const setupTerminalWS = (ws: WebSocket) => {
  const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
  
  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: process.cwd(),
    env: {
      ...process.env,
      ANDROID_HOME: process.env.ANDROID_HOME,
      JAVA_HOME: process.env.JAVA_HOME,
      PATH: `${process.env.PATH}:${path.join(process.env.ANDROID_HOME || '', 'platform-tools')}`
    }
  });

  ptyProcess.onData((data) => {
    ws.send(JSON.stringify({ type: 'data', content: data }));
  });

  ws.on('message', (message: string) => {
    const data = JSON.parse(message);
    if (data.type === 'data') {
      ptyProcess.write(data.content);
    } else if (data.type === 'resize') {
      ptyProcess.resize(data.cols, data.rows);
    }
  });

  ws.on('close', () => {
    ptyProcess.kill();
  });
};
