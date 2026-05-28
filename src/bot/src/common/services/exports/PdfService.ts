import { PDFDocument, PDFFont, PDFPage, rgb } from 'pdf-lib';
import path from 'node:path';
import fs from 'fs/promises';
import type { ContractExport } from '@shared/types/ContractExport';
import fontkit from '@pdf-lib/fontkit';

export class PdfService {
    private pages: PDFPage[] = [];
    private customFont!: PDFFont;
    private data!: ContractExport;

    async execRender(data: ContractExport): Promise<Uint8Array<ArrayBufferLike>> {
        try {
            console.log('📄 execRender: получены данные:', JSON.stringify(data, null, 2));

            const pdfDoc = await PDFDocument.load(
                await fs.readFile(path.resolve('src', 'bot', 'src', 'common', 'services', 'exports', 'docs', 'contract.pdf'))
            );

            await this.loadFonts(pdfDoc);
            this.data = data;

            this.pages = pdfDoc.getPages();

            if (this.pages.length === 0) {
                throw new Error('PDF не содержит страниц');
            }

            this.render();

            return await pdfDoc.save();
        } catch (error) {
            console.error('❌ Ошибка при генерации PDF:', error);
            throw error;
        }
    }

    render() {
        const d = this.data;
        console.log('🔍 Начало рендера PDF. Проверяем все поля:');

        // ==================== 1-я страница ====================

        this.logAndDraw(0, 'startDay', d.startDay, { x: 412, y: 742 });
        this.logAndDraw(0, 'startMonth', d.startMonth, { x: 442, y: 742 });
        this.logAndDraw(0, 'startYear', d.startYear, { x: 513, y: 742 });

        this.logAndDraw(0, 'startDay (2)', d.startDay, { x: 272, y: 438 });
        this.logAndDraw(0, 'startMonth (2)', d.startMonth, { x: 340, y: 438 });
        this.logAndDraw(0, 'startYear (2)', d.startYear, { x: 448, y: 438 });

        this.logAndDraw(0, 'endDay', d.endDay, { x: 528, y: 438 });
        this.logAndDraw(0, 'endMonth', d.endMonth, { x: 118, y: 424 });
        this.logAndDraw(0, 'endYear', d.endYear, { x: 214, y: 424 });

        // ==================== 2-я страница ====================

        this.logAndDraw(1, 'priceNumber', d.priceNumber, { x: 128, y: 616 });
        this.logAndDraw(1, 'priceString', d.priceString, { x: 302, y: 616 });

        this.logAndDraw(1, 'priceNumber (2)', d.priceNumber, { x: 128, y: 576 });
        this.logAndDraw(1, 'priceString (2)', d.priceString, { x: 302, y: 576 });

        this.logAndDraw(1, 'priceNumber (3)', d.priceNumber, { x: 128, y: 536 });
        this.logAndDraw(1, 'priceString (3)', d.priceString, { x: 302, y: 536 });

        this.logAndDraw(1, 'customerName', d.customerName, { x: 146, y: 84 });
    }

    /**
     * Вспомогательный метод: логирует значение и рисует текст
     */
    private logAndDraw(pageIndex: number, fieldName: string, value: any, options: any) {
        const text = value == null ? null : String(value).trim();

        console.log(`   📌 [Страница ${pageIndex + 1}] ${fieldName}: "${text}" (тип: ${typeof value})`);

        if (text === null || text === '') {
            console.warn(`   ⚠️  Поле ${fieldName} пустое или null!`);
        }

        this.pages[pageIndex]?.drawText(text ?? '', {
            ...options,
            color: rgb(0, 0, 0),
            size: 12,
            font: this.customFont
        });
    }

    private async loadFonts(pdfDoc: PDFDocument) {
        pdfDoc.registerFontkit(fontkit);
        this.customFont = await pdfDoc.embedFont(
            await fs.readFile(path.resolve('src', 'bot', 'src', 'common', 'services', 'exports', 'fonts', 'Roboto-Regular.ttf'))
        );
    }
}