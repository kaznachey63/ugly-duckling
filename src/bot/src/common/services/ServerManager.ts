import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);
import type { Status } from '@shared/types/server/Status';
import constants from '@constants';

export class ServerManager {
    /**
     * Выполнение команды на сервере (напрямую, без SSH)
     * @param cmd Команда
     * @param allowNonZeroExit Разрешить ненулевой exit code (для info-команд)
     */
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

    async restartService(serviceName: string, isDistribution = false): Promise<void> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        const cmd = `sudo systemctl restart ${name}`;

        console.log(`[SYSTEMCTL] Executing: ${cmd}`);

        const { stdout, stderr, code } = await this.exec(cmd, true);

        console.log(`[SYSTEMCTL] Code: ${code}, Stdout: "${stdout.trim()}", Stderr: "${stderr.trim()}"`);

        const realErrors = ['not found', 'failed', 'access denied', 'interactive authentication', 'invalid', 'no such'];
        const hasRealError = realErrors.some(e => (stdout + stderr).toLowerCase().includes(e));

        if (code !== 0 && hasRealError) {
            throw new Error(`systemctl failed: ${stderr.trim() || stdout.trim()}`);
        }
    }

    async startService(serviceName: string, isDistribution = false): Promise<void> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        const { stderr, code } = await this.exec(`sudo systemctl start ${name}`, true);

        const realErrors = ['not found', 'failed', 'access denied', 'interactive authentication'];
        const hasRealError = realErrors.some(e => stderr.toLowerCase().includes(e));

        if (code !== 0 && hasRealError) {
            throw new Error(`systemctl failed: ${stderr.trim()}`);
        }
    }

    async stopService(serviceName: string, isDistribution = false): Promise<void> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        const { stderr, code } = await this.exec(`sudo systemctl stop ${name}`, true);

        const realErrors = ['not found', 'failed', 'access denied', 'interactive authentication'];
        const hasRealError = realErrors.some(e => stderr.toLowerCase().includes(e));

        if (code !== 0 && hasRealError) {
            throw new Error(`systemctl failed: ${stderr.trim()}`);
        }
    }
    async isServiceActive(serviceName: string, isDistribution = false): Promise<boolean> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        const { stdout } = await this.exec(
            `sudo systemctl show ${name} --property=ActiveState --value`,
            true
        );
        return stdout.trim().toLowerCase() === "active";
    }

    async restartProcessOrNot(serviceName: string, isDistribution = false): Promise<boolean> {
        const name = this.resolveServiceName(serviceName, isDistribution);

        // Надежная проверка: был ли сервис активен
        const wasActive = await this.isServiceActive(serviceName, isDistribution);

        console.log(`[SYSTEMCTL] ${name} was active: ${wasActive}`);

        if (wasActive) {
            await this.restartService(serviceName, isDistribution);
            // Микро-пауза, чтобы systemd успел принять команду
            await new Promise(resolve => setTimeout(resolve, 500));
            return true;
        }

        // Не был активен — ничего не делаем
        return true;
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

    async getServiceStatus(serviceName: string, isDistribution = false): Promise<Status> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        const { stdout } = await this.exec(`sudo systemctl is-active ${name}`, true);
        return stdout.trim() as Status;
    }

    private resolveServiceName(name: string, isDistribution: boolean): string {
        return isDistribution
            ? `hawk-sendout@${name}.service`
            : name
        ;                                 
    }
}