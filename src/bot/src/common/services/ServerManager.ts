import { exec, execSync } from 'child_process';
import type { Status } from '@shared/types/server/Status';
import type { ProcessType } from '@shared/types/ProcessType';

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

    private resolveServiceName(name: string, isSendout: boolean): string {
        return isSendout ? `hawk-sendout@${name}.service` : name;
    }

    async startService(serviceName: string, isSendout = false): Promise<void> {
        const name = this.resolveServiceName(serviceName, isSendout);
        await this.exec(`sudo systemctl start ${name}`, 30000);
    }

    async restartService(serviceName: string, isSendout = false): Promise<void> {
        const name = this.resolveServiceName(serviceName, isSendout);
        await this.exec(`sudo systemctl restart ${name}`, 30000);
    }

    async stopService(serviceName: string, isSendout = false): Promise<void> {
        const name = this.resolveServiceName(serviceName, isSendout);
        await this.exec(`sudo systemctl stop ${name}`, 30000);
    }

    async getServiceStatus(serviceName: string, isSendout = false): Promise<Status> {
        const name = this.resolveServiceName(serviceName, isSendout);
        const { stdout } = await this.exec(`sudo systemctl is-active ${name}`, 5000);
        const state = stdout.toLowerCase();
        if (state === 'active') return 'active';
        if (state === 'failed') return 'failed';
        if (state === 'activating') return 'activating';
        if (state === 'deactivating') return 'deactivating';
        if (state === 'maintenance') return 'maintenance';
        return 'inactive';
    }

    async getServiceExitCode(serviceName: string, isSendout = false): Promise<number> {
        const name = this.resolveServiceName(serviceName, isSendout);
        const { stdout } = await this.exec(`sudo systemctl show ${name} --property=ExecMainStatus`, 5000);
        const value = stdout.split('=')[1]!;
        const code = parseInt(value, 10);
        return isNaN(code) ? 0 : code;
    }

    async isServiceActive(serviceName: string, isSendout = false): Promise<boolean> {
        return (await this.getServiceStatus(serviceName, isSendout)) === 'active';
    }

    async restartProcessOrNot(serviceName: string, isSendout = false): Promise<boolean> {
        const wasActive = await this.isServiceActive(serviceName, isSendout);
        if (wasActive) {
            await this.restartService(serviceName, isSendout);
            await new Promise(resolve => setTimeout(resolve, 500));
            return true;
        }
        return true;
    }

    async getProcessesByProcessType(processType: ProcessType): Promise<string[]> {
        const allProcesses = execSync("systemctl list-units --type=service --all --no-pager --no-legend", { encoding: "utf-8"} );
        const targetProcesses: string[] = [];

        for (const line of allProcesses.trim()) {
            const serviceName = line.split(/\s+/)[0];
            if (serviceName?.endsWith(".service") || serviceName?.includes(processType)) targetProcesses.push(serviceName);
        }
        return targetProcesses;
    }
}