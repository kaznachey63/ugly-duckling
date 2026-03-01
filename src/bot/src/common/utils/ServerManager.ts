import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

import type { Action } from "@shared/types/server/Action";
import type { Status } from "@shared/types/server/Status";
import type { Result } from "@shared/types/server/Result";
import utils from './index';

export class ServerManager {

    /**
     * Выполнение команды напрямую на сервере (без SSH!)
     */
    public async execute(action: Action, nameDistribution: string): Promise<Result> {
        try {
            const command = this.getCommand(action, nameDistribution);

            // 🔴 Для 'status' и 'log' разрешаем ненулевой exit code
            // Они информационные, а не управляющие команды
            const isInfoCommand = ['status', 'log'].includes(action);

            let stdout: string, stderr: string;

            try {
                const result = await execAsync(command, {
                    timeout: 10000,
                    shell: '/bin/bash'
                });
                stdout = result.stdout;
                stderr = result.stderr;
            } catch (err: any) {
                // Если команда информационная — берем вывод из ошибки
                if (isInfoCommand) {
                    stdout = err.stdout || '';
                    stderr = err.stderr || '';
                    // ❗ Не выбрасываем ошибку, продолжаем парсить stdout
                } else {
                    // Для управляющих команд (start/stop/restart) ошибка — это действительно ошибка
                    console.error(`❌ Команда '${command}' не выполнена:`, err.message);
                    throw err;
                }
            }

            // Логируем предупреждения, если есть
            if (stderr && !stderr.trim().startsWith('Warning:')) {
                console.warn(`⚠️ ${command}: ${stderr.trim()}`);
            }

            const isSetAction = this.isSetAction(action);
            if (isSetAction) return undefined;

            switch (action) {
                case 'status': return this.getValueOfStatus(stdout);
                case 'log': return this.getLogs(stdout);
            }

            return undefined;
        } catch (error: any) {
            console.error("❌ Ошибка при выполнении команды:", error.message);
            return undefined;
        }
    }

    /**
     * Перезапуск или нет процесса сервера
     */
    public async restartProcessOrNot(nameDistribution: string): Promise<boolean> {
        const status = await this.execute("status", nameDistribution) as Status;

        if (status === "active") {
            await this.execute("restart", nameDistribution);
            const newStatus = await this.execute("status", nameDistribution) as Status;
            return newStatus === "active";
        }
        return true;
    }
    // ... остальные методы (getCommand, getCtl, isSetAction, getValueOfStatus, getLogs) 
    // оставляешь без изменений, они универсальны
    private getCommand(action: Action, nameDistribution: string): string {
        const nameProcess = utils.local.getNameProcess(nameDistribution);
        const ctl = this.getCtl(action);
        return action === "log"
            ? `${ctl} ${nameProcess}`
            : `${ctl} ${action} ${nameProcess}`;
    }

    private getCtl(action: Action): string {
        return action === "log" ? "journalctl -u" : "systemctl";
    }

    private isSetAction(action: Action): boolean {
        return !["status", "log"].includes(action);
    }

    private getValueOfStatus(stdout: string): Status {
        if (stdout.includes("Active: active")) return "active";
        if (stdout.includes("Active: inactive")) return "inactive";
        if (stdout.includes("Active: failed")) return "failed";
        return "";
    }

    private getLogs(stdout: string): string {
        return stdout;
    }
}