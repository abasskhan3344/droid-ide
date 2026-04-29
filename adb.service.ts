import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class ADBService {
  static async listDevices() {
    try {
      const { stdout } = await execAsync('adb devices');
      const lines = stdout.split('\n').filter(line => line.trim() !== '');
      // Remove header
      lines.shift();
      return lines.map(line => {
        const [id, status] = line.split('\t');
        return { id, status };
      });
    } catch (err) {
      console.error('ADB Error:', err);
      return [];
    }
  }

  static async installAPK(deviceId: string, apkPath: string) {
    const { stdout } = await execAsync(`adb -s ${deviceId} install ${apkPath}`);
    return stdout;
  }
}