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
                timeout: constants.server.timeout, // 30 сек
                shell: '/bin/bash'
            });
            return { stdout: result.stdout, stderr: result.stderr, code: 0 };
        } catch (err: any) {
            // Для информационных команд (статус, логи) — не кидаем ошибку, просто возвращаем вывод
            if (allowNonZeroExit) {
                return {
                    stdout: err.stdout || '',
                    stderr: err.stderr || '',
                    code: err.code ?? null
                };
            }
            // Для управляющих команд (start/stop/restart) — ошибка это действительно ошибка
            console.error(`❌ Команда '${cmd}' не выполнена:`, err.message);
            throw err;
        }
    }

    async startService(serviceName: string, isDistribution = false): Promise<void> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        await this.exec(`sudo systemctl start ${name}`);
    }

    async restartService(serviceName: string, isDistribution = false): Promise<void> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        await this.exec(`sudo systemctl restart ${name}`);
    }

    async stopService(serviceName: string, isDistribution = false): Promise<void> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        await this.exec(`sudo systemctl stop ${name}`);
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
        const status = await this.getServiceStatus(serviceName, isDistribution);

        if (status === "active") {
            // Был запущен → делаем рестарт
            await this.restartService(serviceName, isDistribution);
            return await this.getServiceStatus(serviceName, isDistribution) === "active";
        }

        // Не был запущен → ничего не делаем
        return true;
    }

    private resolveServiceName(name: string, isDistribution: boolean): string {
        return isDistribution
            ? `hawk-sendout@${name}.service`
            : name
        ;                                 
    }
}