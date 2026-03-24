import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);
import type { Status } from '@shared/types/server/Status';
import constants from '@constants';

export class ServerManager {
    private async exec(cmd: string, allowNonZeroExit = false): Promise<{ stdout: string; stderr: string; code: number | null }> {
        try {
            const result = await execAsync(cmd, {
                timeout: constants.server.timeout,
                shell: '/bin/bash'
            });
            return { stdout: result.stdout, stderr: result.stderr, code: 0 };
        } catch (err: any) {
            if (allowNonZeroExit) {
                return {
                    stdout: err.stdout || '',
                    stderr: err.stderr || '',
                    code: err.code ?? null
                };
            }
            console.error(`❌ Команда '${cmd}' не выполнена:`, err.message);
            throw err;
        }
    }

    private resolveServiceName(name: string, isDistribution: boolean): string {
        return isDistribution ? `hawk-sendout@${name}.service` : name;
    }

    async startService(serviceName: string, isDistribution = false): Promise<void> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        const { stderr, code } = await this.exec(`sudo systemctl start ${name}`, true);
        const output = (stderr + '').toLowerCase();
        const realErrors = ['not found', 'failed to', 'access denied', 'interactive authentication', 'no such', 'invalid'];
        if (code !== 0 && realErrors.some(e => output.includes(e))) {
            throw new Error(stderr.trim() || 'Failed to start service');
        }
    }

    async restartService(serviceName: string, isDistribution = false): Promise<void> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        const { stderr, code } = await this.exec(`sudo systemctl restart ${name}`, true);
        const output = (stderr + '').toLowerCase();
        const realErrors = ['not found', 'failed to', 'access denied', 'interactive authentication', 'no such', 'invalid'];
        if (code !== 0 && realErrors.some(e => output.includes(e))) {
            throw new Error(stderr.trim() || 'Failed to restart service');
        }
    }

    async stopService(serviceName: string, isDistribution = false): Promise<void> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        const { stderr, code } = await this.exec(`sudo systemctl stop ${name}`, true);
        const output = (stderr + '').toLowerCase();
        const realErrors = ['not found', 'failed to', 'access denied', 'interactive authentication', 'no such', 'invalid'];
        if (code !== 0 && realErrors.some(e => output.includes(e))) {
            throw new Error(stderr.trim() || 'Failed to stop service');
        }
    }

    async isServiceActive(serviceName: string, isDistribution = false): Promise<boolean> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        const { stdout } = await this.exec(
            `sudo systemctl show ${name} --property=ActiveState --value`,
            true
        );
        return stdout.trim().toLowerCase() === 'active';
    }

    async getServiceStatus(serviceName: string, isDistribution = false): Promise<Status> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        const { stdout } = await this.exec(
            `sudo systemctl show ${name} --property=ActiveState --value`,
            true
        );
        const state = stdout.trim().toLowerCase();
        const validStates: Status[] = ['active', 'inactive', 'failed', 'activating', 'deactivating'];
        return validStates.includes(state as Status) ? (state as Status) : '';
    }

    async getServiceExitCode(serviceName: string, isDistribution = false): Promise<number | null> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        const { stdout } = await this.exec(
            `sudo systemctl show ${name} --property=ExecMainStatus --value`,
            true
        );
        const code = parseInt(stdout.trim(), 10);
        return isNaN(code) ? null : code;
    }

    async getServiceLogs(serviceName: string, lines = 0, isDistribution = false): Promise<string> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        const { stdout } = await this.exec(
            `sudo journalctl -u ${name} -n ${lines} --no-pager`,
            true
        );
        return stdout;
    }

    async restartProcessOrNot(serviceName: string, isDistribution = false): Promise<boolean> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        const wasActive = await this.isServiceActive(serviceName, isDistribution);
        if (wasActive) {
            await this.restartService(serviceName, isDistribution);
            await new Promise(resolve => setTimeout(resolve, 500));
            return true;
        }
        return true;
    }
}