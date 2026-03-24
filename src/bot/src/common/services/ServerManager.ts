import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);
import type { Status } from '@shared/types/server/Status';

export class ServerManager {
    private async exec(cmd: string, timeoutMs = 30000): Promise<{ stdout: string; stderr: string }> {
        return new Promise((resolve, reject) => {
            exec(cmd, {
                timeout: timeoutMs,
                shell: '/bin/bash',
                env: { ...process.env, PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin' },
                encoding: 'utf8'
            }, (error, stdout, stderr) => {
                if (error && (error as any).signal === 'SIGTERM') {
                    console.error(`[SYSTEMCTL] Command timed out: ${cmd}`);
                    reject(new Error(`Timeout: ${cmd}`));
                    return;
                }
                resolve({
                    stdout: (stdout || '').toString().trim(),
                    stderr: (stderr || '').toString().trim()
                });
            });
        });
    }

    private resolveServiceName(name: string, isDistribution: boolean): string {
        return isDistribution ? `hawk-sendout@${name}.service` : name;
    }

    async startService(serviceName: string, isDistribution = false): Promise<void> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        await this.exec(`sudo systemctl start ${name}`, 30000);
    }

    async restartService(serviceName: string, isDistribution = false): Promise<void> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        await this.exec(`sudo systemctl restart ${name}`, 30000);
    }

    async stopService(serviceName: string, isDistribution = false): Promise<void> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        await this.exec(`sudo systemctl stop ${name}`, 30000);
    }

    async getServiceStatus(serviceName: string, isDistribution = false): Promise<Status> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        const { stdout } = await this.exec(`sudo systemctl is-active ${name}`, 5000);
        const state = stdout.toLowerCase();
        if (state === 'active') return 'active';
        if (state === 'failed') return 'failed';
        if (state === 'activating') return 'activating';
        if (state === 'deactivating') return 'deactivating';
        if (state === 'maintenance') return 'maintenance';
        return 'inactive';
    }

    async isServiceActive(serviceName: string, isDistribution = false): Promise<boolean> {
        return (await this.getServiceStatus(serviceName, isDistribution)) === 'active';
    }

    async restartProcessOrNot(serviceName: string, isDistribution = false): Promise<boolean> {
        const wasActive = await this.isServiceActive(serviceName, isDistribution);
        if (wasActive) {
            await this.restartService(serviceName, isDistribution);
            await new Promise(resolve => setTimeout(resolve, 500));
            return true;
        }
        return true;
    }
}