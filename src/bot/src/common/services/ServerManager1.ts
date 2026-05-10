import { NodeSSH, type SSHExecCommandResponse } from 'node-ssh';
import type { ServiceStatus } from '@shared/types/ServiceStatus';
import fs from 'fs/promises';

export class ServerManager {
    private async connectSsh(): Promise<NodeSSH> {
        const ssh = new NodeSSH();
        await ssh.connect({
            host: process.env.SERVER_HOST,
            username: process.env.SERVER_USERNAME,
            privateKey: await fs.readFile(process.env.SERVER_SSH_KEY_PATH!, 'utf8')
        });
        return ssh;
    }

    private async exec(cmd: string): Promise<SSHExecCommandResponse> {
        const ssh = await this.connectSsh();
        try {
            return await ssh.execCommand(cmd);
        } finally {
            ssh.dispose();
        }
    }
    async startService(serviceName: string, isSendout = false): Promise<void> {
        const name = this.resolveServiceName(serviceName, isSendout);
        await this.exec(`systemctl start ${name}`);
    }

    async restartService(serviceName: string, isSendout = false): Promise<void> {
        const name = this.resolveServiceName(serviceName, isSendout);
        await this.exec(`systemctl restart ${name}`);
    }

    async stopService(serviceName: string, isSendout = false): Promise<void> {
        const name = this.resolveServiceName(serviceName, isSendout);
        await this.exec(`systemctl stop ${name}`);
    }

    async isServiceActive(serviceName: string, isSendout = false): Promise<boolean> {
        const name = this.resolveServiceName(serviceName, isSendout);
        const { stdout, code } = await this.exec(`systemctl is-active ${name}`);
        return code === 0 && stdout.trim() === "active";
    }

    async getServiceExitCode(serviceName: string, isSendout = false): Promise<number | null> {
        const name = this.resolveServiceName(serviceName, isSendout);
        const { stdout } = await this.exec(
            `systemctl show ${name} --property=ExecMainStatus --value`
        );
        const code = parseInt(stdout.trim(), 10);
        return isNaN(code) ? null : code;
    }

    async getServiceLogs(serviceName: string, lines = 0, isSendout = false): Promise<string> {
        const name = this.resolveServiceName(serviceName, isSendout);
        const { stdout } = await this.exec(
            `journalctl -u ${name} -n ${lines} --no-pager`
        );
        return stdout;
    }

    async getServiceStatus(serviceName: string, isSendout = false): Promise<ServiceStatus> {
        const name = this.resolveServiceName(serviceName, isSendout);
        const { stdout } = await this.exec(`systemctl is-active ${name}`);
        return stdout.trim() as ServiceStatus;
    }

    async restartProcessOrNot(serviceName: string, isSendout = false): Promise<boolean> {
        const status = await this.getServiceStatus(serviceName, isSendout);

        if (status === "active") {
            // Был запущен → делаем рестарт
            await this.restartService(serviceName, isSendout);
            return await this.getServiceStatus(serviceName, isSendout) === "active";
        }

        // Не был запущен → ничего не делаем
        return true;
    }

    private resolveServiceName(name: string, isSendout: boolean): string {
        return isSendout
            ? `hawk-sendout@${name}.service`
            : name
        ;
    }
}