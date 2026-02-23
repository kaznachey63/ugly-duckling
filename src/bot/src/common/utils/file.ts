import fs from 'fs/promises';
import path from 'path';

/**
 * Чтение даных рассылки из файла json
 * @param nameDistribution Прог. имя рассылки
 * @param folderName Название папки целевых данных
 * @param fileName Название файла (json) без расширения
 * @returns Если целевой файл не пуст - парсинговый массив формата json, иначе вернет пустой массив
 */
// async function readJson(nameDistribution: string, folderName: string, fileName: string): Promise<any[]> {
//     const filePath = path.join('..', "rassilka_app", "programs", `rassilka_${nameDistribution.toLowerCase()}`, folderName, `${fileName}.json`);
//     const dataFile = await fs.readFile(filePath, "utf-8");
//     return dataFile ? JSON.parse(dataFile) : [];
// }

/**
 * Сохранение (обновление) даных рассылки в виде строки
 * @param nameDistribution Прог. имя рассылки
 * @param dataToFile Данные для сохранения в виде строки
 * @param folderName Название папки, куда сохранять данные
 * @param fileName Название файла без расширения
 */
// async function saveData(nameDistribution: string, dataToFile: string, folderName: string, fileName: string) {
//     const filePath = path.join('..', "rassilka_app", "programs", `rassilka_${nameDistribution.toLowerCase()}`, folderName, `${fileName}.json`);
//     await fs.writeFile(filePath, dataToFile, "utf-8");
// }

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
    // readJson,
    // saveData,
    saveFile,
    createCtxFile,
    deleteFile
};