import { PDFDocument, PDFFont, PDFPage, rgb } from 'pdf-lib';
import path from 'node:path';
import fs from 'fs/promises'
import type { ContractExport } from '@shared/types/ContractExport';
import fontkit from '@pdf-lib/fontkit';

export class PdfService {
    private pages: PDFPage[] = [];
    private customFont!: PDFFont;
    private data!: ContractExport;

    async execRender(data: ContractExport): Promise<Uint8Array>  {
        try {
            // const dataName = this.determineData(data);
            const pdfDoc = await PDFDocument.load(await fs.readFile(path.resolve(process.cwd(), 'assets', 'bot', 'exports', 'docs', 'contract.pdf')));

            if (!pdfDoc) {
                throw new Error('Невалидный тип данных');
            }

            await this.loadFonts(pdfDoc);
            this.data = data;

            this.pages = pdfDoc!.getPages();

            if (this.pages.length === 0) {
                throw new Error('PDF не содержит страниц');
            }

            this.render();

            return await pdfDoc!.save();
        } catch (error) {
            console.error('Ошибка:', error);
            throw error;
        }
    }

    render() {
        // 1-я страница
        this.pages[0]?.drawText(this.data.startDay, {
            x: 412,
            y: 742,
            color: rgb(0, 0, 0),
            size: 12,
            font: this.customFont
        });

        this.pages[0]?.drawText(this.data.startMonth, {
            x: 442,
            y: 742,
            color: rgb(0, 0, 0),
            size: 12,
            font: this.customFont
        });

        this.pages[0]?.drawText(this.data.startYear, {
            x: 513,
            y: 742,
            color: rgb(0, 0, 0),
            size: 12,
            font: this.customFont
        });

        this.pages[0]?.drawText(this.data.startDay, {
            x: 272,
            y: 438,
            color: rgb(0, 0, 0),
            size: 12,
            font: this.customFont
        });

        this.pages[0]?.drawText(this.data.startMonth, {
            x: 340,
            y: 438,
            color: rgb(0, 0, 0),
            size: 12,
            font: this.customFont
        });

        this.pages[0]?.drawText(this.data.startYear, {
            x: 448,
            y: 438,
            color: rgb(0, 0, 0),
            size: 12,
            font: this.customFont
        });

        this.pages[0]?.drawText(this.data.endDay, {
            x: 528,
            y: 438,
            color: rgb(0, 0, 0),
            size: 12,
            font: this.customFont
        });

        this.pages[0]?.drawText(this.data.endMonth, {
            x: 118,
            y: 424,
            color: rgb(0, 0, 0),
            size: 12,
            font: this.customFont
        });

        this.pages[0]?.drawText(this.data.endYear, {
            x: 214,
            y: 424,
            color: rgb(0, 0, 0),
            size: 12,
            font: this.customFont
        });

        // 2-я страница
        this.pages[1]?.drawText(this.data.priceNumber, {
            x: 128,
            y: 616,
            color: rgb(0, 0, 0),
            size: 12,
            font: this.customFont
        });

        this.pages[1]?.drawText(this.data.priceString, {
            x: 302,
            y: 616,
            color: rgb(0, 0, 0),
            size: 12,
            font: this.customFont
        });

        this.pages[1]?.drawText(this.data.priceNumber, {
            x: 128,
            y: 576,
            color: rgb(0, 0, 0),
            size: 12,
            font: this.customFont
        });

        this.pages[1]?.drawText(this.data.priceString, {
            x: 302,
            y: 576,
            color: rgb(0, 0, 0),
            size: 12,
            font: this.customFont
        });

        this.pages[1]?.drawText(this.data.priceNumber, {
            x: 128,
            y: 536,
            color: rgb(0, 0, 0),
            size: 12,
            font: this.customFont
        });

        this.pages[1]?.drawText(this.data.priceString, {
            x: 302,
            y: 536,
            color: rgb(0, 0, 0),
            size: 12,
            font: this.customFont
        });

        this.pages[1]?.drawText(this.data.customerName, {
            x: 146,
            y: 84,
            color: rgb(0, 0, 0),
            size: 12,
            font: this.customFont
        });
    }
    
    async write(data: string): Promise<Uint8Array> {
        const pdfDoc = await PDFDocument.create();
        await this.loadFonts(pdfDoc);

        const pageWidth = 600;
        const marginX = 50;
        const marginY = 40;
        const fontSize = 14;
        const lineHeight = 18;
        const maxWidth = pageWidth - marginX * 2;

        // Разбиваем на логические строки (по \n)
        const logicalLines = data.split('\n');

        // Для каждой строки считаем, сколько физических строк она займёт (перенос по ширине)
        const physicalLines: string[] = [];
        for (const line of logicalLines) {
            if (line.trim() === '') {
                physicalLines.push('');
                continue;
            }
            // Грубый расчёт: ~0.6px на символ при 14pt шрифте
            const charsPerLine = Math.floor(maxWidth / (fontSize * 0.6));
            if (line.length <= charsPerLine) {
                physicalLines.push(line);
            } else {
                // Переносим длинные строки
                for (let i = 0; i < line.length; i += charsPerLine) {
                    physicalLines.push(line.slice(i, i + charsPerLine));
                }
            }
        }

        const contentHeight = physicalLines.length * lineHeight + marginY * 2;
        const page = pdfDoc.addPage([pageWidth, contentHeight]);

        let y = contentHeight - marginY;
        for (const line of physicalLines) {
            page.drawText(line, { x: marginX, y, size: fontSize, font: this.customFont, color: rgb(0, 0, 0) });
            y -= lineHeight;
        }

        return await pdfDoc.save();
    }
    
    private async loadFonts(pdfDoc: PDFDocument) {
        pdfDoc!.registerFontkit(fontkit);
        this.customFont = await pdfDoc!.embedFont(await fs.readFile(path.resolve(process.cwd(), 'assets', 'bot', 'exports', 'fonts', 'Roboto-Regular.ttf')));
    }
}