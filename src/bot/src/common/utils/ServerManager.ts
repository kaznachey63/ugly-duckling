import { NodeSSH, type SSHExecCommandResponse } from 'node-ssh';
import utils from './index';

import type { Action } from "@shared/types/server/Action";
import type { Ctl } from "@shared/types/server/Ctl";
import type { Status } from "@shared/types/server/Status";
import type { Result } from "@shared/types/server/Result";

export class ServerManager {
    /**
     * Подключение к серверу
     * @returns Объект сервера  
     */
    private async connectSsh(): Promise<NodeSSH> {
        const ssh = new NodeSSH();
        await ssh.connect({
            host: process.env.SERVER_HOST,
            username: process.env.SERVER_USERNAME,
            password: process.env.SERVER_PASSWORD
        });
        return ssh;
    }
    
    /**
     * Выполнение команды на сервере
     * @param action Событие
     * @param nameDistribution Имя рассылки
     * @returns type Return
     */
    public async execute(action: Action, nameDistribution: string): Promise<Result> {
        const ssh = await this.connectSsh();
        try {
            const isSetAction = this.isSetAction(action);
            const command = this.getCommand(action, nameDistribution);
            const result = await ssh.execCommand(command);

            if (isSetAction) {
                return undefined;
            }
            else {
                // ✅ ТВОЙ SWITCH
                switch (action) {
                    case 'status': {
                        return this.getValueOfStatus(result);
                    }
                    case 'log': {
                        return this.getLogs(result);
                    }
                }
            }
        } catch (e) {
            console.error("Ошибка при выполнении действия над процессом");
            return undefined;
        } finally {
            ssh.dispose();
        }
    }

    /**
     * Перезапуск или нет процесса сервера. 
     * Если процесс активен - перезапуск. Нет - без перезапуска.
     * @returns true - всё ок, false - ошибка после перезапуска
     */
    public async restartProcessOrNot(nameDistribution: string): Promise<boolean> {
        const status = await this.execute("status", nameDistribution) as Status;

        // Если был активен — перезапускаем
        if (status === "active") {
            await this.execute("restart", nameDistribution);

            // Проверяем после перезапуска
            const newStatus = await this.execute("status", nameDistribution) as Status;
            return newStatus === "active";
        }

        // Если был не активен — не трогаем, считаем успехом
        return true;
    }

    /**
     * Получение команды
     * @param action Событие
     * @param nameDistribution Имя рассылки
     * @returns Команда
     */
    private getCommand(action: Action, nameDistribution: string): string {
        const nameProcess = utils.local.getNameProcess(nameDistribution);
        const ctl = this.getCtl(action);
        return action === "log"
            ? `${ctl} ${nameProcess}`
            : `${ctl} ${action} ${nameProcess}`
        ;
    }

    /**
     * Получение ctl
     * @param action Событие
     * @returns Ctl
     */
    private getCtl(action: Action): Ctl {
        return action === "log" ? "journalctl -u" : "systemctl";
    }

    /**
     * Определение типа GetAction
     * @param action Событие
     * @returns True - если да, иначе - false
     */
    private isSetAction(action: Action): boolean {
        return !["status", "log"].includes(action);
    }

    /**
     * Получение значения статуса процеса
     * @param result Результат выполнения команды
     * @returns Строку, обозначающую результат
     */
    private getValueOfStatus(result: SSHExecCommandResponse): Status {
        if (result.stdout.includes("Active: active")) return "active";
        if (result.stdout.includes("Active: inactive")) return "inactive";
        if (result.stdout.includes("Active: failed")) return "failed";
        return "";
    }

    /**
     * Получение логов процесса
     * @param result Результат выполнения команды
     * @returns Логи
     */
    private getLogs(result: SSHExecCommandResponse): string {
        return result.stdout;
    }
}