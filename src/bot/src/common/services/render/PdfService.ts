import { PDFDocument, PDFFont, PDFPage, rgb } from 'pdf-lib';
import path from 'node:path';
import fs from 'fs/promises'
import type { ContractData } from '@shared/types/ContractData';
import fontkit from '@pdf-lib/fontkit';

export class PdfService {
    private pages: PDFPage[] = [];
    private customFont!: PDFFont;
    private data!: ContractData;

    async execRender(data: ContractData): Promise<Uint8Array<ArrayBufferLike>> {
        try {
            const pdfDoc = await PDFDocument.load(await fs.readFile(path.resolve('common', 'services', 'render', 'contracts', 'contract.pdf')));
            pdfDoc.registerFontkit(fontkit);
            this.customFont = await pdfDoc.embedFont(await fs.readFile(path.resolve('common', 'services', 'render', 'fonts', 'Roboto-Regular.ttf')));
            this.data = data;
            this.pages = pdfDoc.getPages();

            if (this.pages.length === 0) {
                throw new Error('PDF не содержит страниц');
            }

            this.render();

            return await pdfDoc.save();
        } catch (error) {
            console.error('Ошибка:', error);
            throw error;
        }
    }

    private render() {
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
}