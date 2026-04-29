import { spawn } from 'child_process';
import path from 'path';

export class GradleService {
  static buildDebug(projectPath: string, onData: (data: string) => void, onExit: (code: number | null) => void) {
    const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
    const process_exec = spawn(gradlew, ['assembleDebug'], {
        cwd: projectPath,
        env: { ...process.env, JAVA_HOME: process.env.JAVA_HOME }
    });

    process_exec.stdout.on('data', (data) => onData(data.toString()));
    process_exec.stderr.on('data', (data) => onData(data.toString()));
    process_exec.on('close', (code) => onExit(code));

    return process_exec;
  }
}