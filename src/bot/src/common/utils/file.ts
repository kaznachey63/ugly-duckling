import fs from 'fs/promises';
import path from 'path';

/**
 * Сохранение (обновление) даных рассылки в виде строки
 * @param nameDistribution Прог. имя рассылки
 * @param dataToFile Данные для сохранения файла
 * @param fileName Название файла c расширением
 */
async function saveFile(dataToFile: any, fileName: string) {
    const filePath = path.join(
        '..',
        'sendout',
        'resources',
        fileName
    );    
    await fs.writeFile(filePath, dataToFile, "utf-8");
}

async function deleteFile(fileName: string): Promise<void> {
    const filePath = path.join(
        '..',
        'sendout',
        'resources',
        fileName
    );
    await fs.unlink(filePath);
}

/**
 * Создает фалй формата json для просмотра ctx
 * @param ctx Контекст
 */
async function createCtxFile(ctx: any) {
    await fs.writeFile("ctx.json", JSON.stringify(ctx, null, 2), "utf-8");
}

export default {
    saveFile,
    createCtxFile,
    deleteFile
};