import { exec, execSync } from 'child_process';
import type { ProcessStatus } from '@shared/types/ProcessStatus';
import type { ProcessType } from '@shared/types/ProcessType';
import db from '@shared/db';

export class ServerManager {
    /**
     * Выполнение запроса на сервере с укзанаием команды и задержки
     */
    private async execute(cmd: string, timeoutMs = 30000): Promise<{ stdout: string; stderr: string }> {
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

    /**
     * Проверка на необходимость перезапуска процесса
     */
    async restartProcessOrNot(name: string, isSendout = false): Promise<boolean> {
        const processName = isSendout ? `hawk-sendout@${name}.service` : name;
        const wasActive = await this.isProcessActive(processName);
        if (wasActive) {
            await this.restartProcess(processName);
            await new Promise(resolve => setTimeout(resolve, 500));
            return true;
        }
        return true;
    }

    /**
     * Проверка процесса на активность
     */ 
    async isProcessActive(name: string): Promise<boolean> {
        return (await this.getProcessStatus(name)) === 'active';
    }

    /**
     * Получение кода выполнения
     */
    async getProcessExitCode(name: string): Promise<number> {
        const { stdout } = await this.execute(`sudo systemctl show ${name} --property=ExecMainStatus`, 5000);
        const value = stdout.split('=')[1]!;
        const code = parseInt(value, 10);
        return isNaN(code) ? 0 : code;
    }

    /**
     * Перезапуск процесса по имени
     */
    async restartProcess(name: string): Promise<void> {
        await this.execute(`sudo systemctl restart ${name}`, 30000);
    }

    /**
     * Остановка процесса по имени
     */
    async stopProcess(name: string): Promise<void> {
        await this.execute(`sudo systemctl stop ${name}`, 30000);
    }

    /**
     * Запуск процесса по имени
     */
    async startProcess(name: string): Promise<void> {
        await this.execute(`sudo systemctl start ${name}`, 30000);
    }

    /**
     * Получение статуса процесса по имени
     */
    async getProcessStatus(name: string): Promise<ProcessStatus> {
        const { stdout } = await this.execute(`sudo systemctl is-active ${name}`, 5000);
        const state = stdout.toLowerCase() as ProcessStatus;
        return state;
    }

    /**
     * Получение списка процессов по типу процесса
     */
    async getProcessesByProcessType(processType: ProcessType): Promise<string[]> {
        const { stdout } = await this.execute("systemctl list-unit-files --type=service --no-legend --no-pager", 5000);
        if (processType == 'sendout') {
            const sendouts = await db.sendout.getSendouts();
            return sendouts.map(s => `hawk-sendout@${s.name}.service`);
        }
        
        // @ts-ignore
        return stdout
            .split('\n')
            .map(l => l.trim().split(/\s+/)[0])
            .filter(name => name!.trim().startsWith(`hawk-${processType}`))
        ;
    }
}