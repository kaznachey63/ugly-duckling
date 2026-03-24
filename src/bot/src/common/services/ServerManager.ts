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
        const { stderr, code } = await this.exec(`sudo systemctl restart ${name}`, true);

        const realErrors = ['not found', 'failed', 'access denied', 'interactive authentication'];
        const hasRealError = realErrors.some(e => stderr.toLowerCase().includes(e));

        if (code !== 0 && hasRealError) {
            throw new Error(`systemctl failed: ${stderr.trim()}`);
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
        const { stdout, code } = await this.exec(`sudo systemctl is-active ${name}`, true);
        return code === 0 && stdout.trim() === "active";
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

    async restartProcessOrNot(serviceName: string, isDistribution = false): Promise<boolean> {
        const name = this.resolveServiceName(serviceName, isDistribution);

        // Проверяем, запущен ли вообще
        const { stdout: statusOut } = await this.exec(`sudo systemctl is-active ${name}`, true);
        const status = statusOut.trim();

        if (status === "active" || status === "activating") {
            // Перезапускаем
            await this.restartService(serviceName, isDistribution);

            // Ждем 500мс, чтобы systemd успел применить изменения
            await new Promise(resolve => setTimeout(resolve, 500));

            // Возвращаем true, т.к. команда рестарта отправлена успешно
            // (проверка is-active сразу после restart ненадежна из-за задержки systemd)
            return true;
        }

        // Если не был запущен — просто возвращаем true (ничего делать не надо)
        return true;
    }

    private resolveServiceName(name: string, isDistribution: boolean): string {
        return isDistribution
            ? `hawk-sendout@${name}.service`
            : name
        ;                                 
    }
}