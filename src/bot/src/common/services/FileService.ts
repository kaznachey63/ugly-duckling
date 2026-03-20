import fs from 'fs/promises';
import path from 'path';

export class FileService {
    private readonly resourcesDir: string;

    constructor() {
        this.resourcesDir = path.join(process.cwd(), 'sendout', 'resources');
    }

    async saveFile(dataToFile: string, fileName: string): Promise<void> {
        const filePath = path.join(this.resourcesDir, fileName);
        await fs.writeFile(filePath, dataToFile, "utf-8");
    }

    async deleteFile(fileName: string): Promise<void> {
        const filePath = path.join(this.resourcesDir, fileName);
        await fs.unlink(filePath);
    }

    async createCtxFile(ctx: any): Promise<void> {
        await fs.writeFile("ctx.json", JSON.stringify(ctx, null, 2), "utf-8");
    }

    async createDir(pathMedia: string): Promise<void> {
        await fs.mkdir(pathMedia, { recursive: true });
    }

    async writeBuffer(filePath: string, buffer: Buffer): Promise<void> {
        await fs.writeFile(filePath, buffer);
    }
}