import { PDFDocument, rgb } from 'pdf-lib';
import path from 'node:path';
import fs from 'fs/promises'
// import fontkit from '@pdf-lib/fontkit'; // <-- ВАЖНО: этот пакет, а не 'fontkit'

// PDFDocument.registerFontkit(fontkit);
const filePath = path.resolve('contract.pdf');
const outputPath = path.resolve('contract_filled.pdf');
// const fontPath = path.resolve('Roboto-Regular.ttf'); // <-- путь к твоему шрифту

try {
    // await PDFDocument.registerFontkit(fontkit);
    const pdfDoc = await PDFDocument.load(await fs.readFile(filePath));
    // Загружаем шрифт
    // const customFontBytes = await fs.readFile(fontPath);
    // const customFont = await pdfDoc.embedFont(customFontBytes);

    const pages = pdfDoc.getPages();

    if (pages.length > 0) {
        // 1-я страница
        pages[0]?.drawText('03', {
            x: 412,
            y: 742,
            color: rgb(0, 0, 0),
            size: 12,
            // font: customFont
        });

        pages[0]?.drawText('Zakaz4ik 3.3', {
            x: 338,
            y: 662,
            color: rgb(0, 0, 0),
            size: 12,
            // font: customFont
        });


        
        pages[0]?.drawText('aprelya', {
            x: 442,
            y: 742,
            color: rgb(0, 0, 0),
            size: 12,
            // font: customFont
        });

        pages[0]?.drawText('26', {
            x: 513,
            y: 742,
            color: rgb(0, 0, 0),
            size: 12,
            // font: customFont
        });

        pages[0]?.drawText('03', {
            x: 272,
            y: 438,
            color: rgb(0, 0, 0),
            size: 12,
            // font: customFont
        });

        pages[0]?.drawText('aprelya', {
            x: 340,
            y: 438,
            color: rgb(0, 0, 0),
            size: 12,
            // font: customFont
        });

        pages[0]?.drawText('26', {
            x: 448,
            y: 438,
            color: rgb(0, 0, 0),
            size: 12,
            // font: customFont
        });

        pages[0]?.drawText('04', {
            x: 528,
            y: 438,
            color: rgb(0, 0, 0),
            size: 12,
            // font: customFont
        });

        pages[0]?.drawText('apreluya', {
            x: 118,
            y: 424,
            color: rgb(0, 0, 0),
            size: 12,
            // font: customFont
        });

        pages[0]?.drawText('26', {
            x: 214,
            y: 424,
            color: rgb(0, 0, 0),
            size: 12,
            // font: customFont
        });

        // 2-я страница
        pages[1]?.drawText('2000', {
            x: 128,
            y: 616,
            color: rgb(0, 0, 0),
            size: 12,
            // font: customFont
        });

        pages[1]?.drawText('dve tisyachi', {
            x: 302,
            y: 616,
            color: rgb(0, 0, 0),
            size: 12,
            // font: customFont
        });

        pages[1]?.drawText('2000', {
            x: 128,
            y: 576,
            color: rgb(0, 0, 0),
            size: 12,
            // font: customFont
        });

        pages[1]?.drawText('dve tisyachi', {
            x: 302,
            y: 576,
            color: rgb(0, 0, 0),
            size: 12,
            // font: customFont
        });

        pages[1]?.drawText('2000', {
            x: 128,
            y: 536,
            color: rgb(0, 0, 0),
            size: 12,
            // font: customFont
        });

        pages[1]?.drawText('dve tisyachi', {
            x: 302,
            y: 536,
            color: rgb(0, 0, 0),
            size: 12,
            // font: customFont
        });

        pages[1]?.drawText('Zakaz4ik 3.3', {
            x: 146,
            y: 84,
            color: rgb(0, 0, 0),
            size: 12,
            // font: customFont
        });

        pages[2]?.drawText('Kaznacheev I.M.', {
            x: 138,
            y: 672,
            color: rgb(0, 0, 0),
            size: 12,
            // font: customFont
        });
    }

    const modifiedPdf = await pdfDoc.save();

    // Сохраняем на диск
    await fs.writeFile(outputPath, modifiedPdf);
    console.log('PDF сохранён:', outputPath);

} catch (error) {
    console.error('Ошибка:', error);
}