import { NodeSSH, type SSHExecCommandResponse } from 'node-ssh';
import utils from './index';
import type { Status } from '@shared/types/server/Status';

export class ServerManager {
    private async connectSsh(): Promise<NodeSSH> {
        const ssh = new NodeSSH();
        await ssh.connect({
            host: process.env.SERVER_HOST,
            username: process.env.SERVER_USERNAME,
            password: process.env.SERVER_PASSWORD
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
    async startService(serviceName: string, isDistribution = false): Promise<void> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        await this.exec(`systemctl start ${name}`);
    }

    async restartService(serviceName: string, isDistribution = false): Promise<void> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        await this.exec(`systemctl restart ${name}`);
    }

    async stopService(serviceName: string, isDistribution = false): Promise<void> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        await this.exec(`systemctl stop ${name}`);
    }

    async isServiceActive(serviceName: string, isDistribution = false): Promise<boolean> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        const { stdout, code } = await this.exec(`systemctl is-active ${name}`);
        return code === 0 && stdout.trim() === "active";
    }

    async getServiceExitCode(serviceName: string, isDistribution = false): Promise<number | null> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        const { stdout } = await this.exec(
            `systemctl show ${name} --property=ExecMainStatus --value`
        );
        const code = parseInt(stdout.trim(), 10);
        return isNaN(code) ? null : code;
    }

    async getServiceLogs(serviceName: string, lines = 20, isDistribution = false): Promise<string> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        const { stdout } = await this.exec(
            `journalctl -u ${name} -n ${lines} --no-pager`
        );
        return stdout;
    }

    async getServiceStatus(serviceName: string, isDistribution = false): Promise<Status> {
        const name = this.resolveServiceName(serviceName, isDistribution);
        const { stdout } = await this.exec(`systemctl is-active ${name}`);
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
        return isDistribution ? utils.local.getNameProcess(name, true) : name;
    }
}