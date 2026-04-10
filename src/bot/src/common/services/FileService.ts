import fs from 'fs/promises';
import path from 'path';

export class FileService {
    private readonly resourcesDir: string;

    constructor() {
        this.resourcesDir = path.join(process.cwd(), 'sendout', 'resources');
    }

    async saveFile(data: string, fileName: string): Promise<void> {
        const filePath = path.join(this.resourcesDir, fileName);
        await fs.writeFile(filePath, data, "utf-8");
    }

    async deleteFile(fileName: string): Promise<void> {
        const filePath = path.join(this.resourcesDir, fileName);
        await fs.unlink(filePath);
    }

    async createCtxFile(ctx: any): Promise<void> {
        await fs.writeFile("ctx.json", JSON.stringify(ctx, null, 2), "utf-8");
    }

    async createDir(filePath: string): Promise<void> {
        await fs.mkdir(filePath, { recursive: true });
    }

    async writeBuffer(filePath: string, buffer: Buffer): Promise<void> {
        await fs.writeFile(filePath, buffer);
    }

    getBuffer(data: string): Buffer<ArrayBuffer> {
        return Buffer.from(data, 'utf-8');
    }
}