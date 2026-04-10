import { PDFDocument, PDFFont, PDFPage, rgb } from 'pdf-lib';
import path from 'node:path';
import fs from 'fs/promises'
import type { ContractData } from '@shared/types/ContractData';
import fontkit from '@pdf-lib/fontkit';
import type { Message } from '@shared/types/Message';

// type Data = ContractData | string;
// type DataName = "contract" | "messages" | "unknown";

export class PdfService {
    private pages: PDFPage[] = [];
    private customFont!: PDFFont;
    private data!: ContractData;

    async execRender(data: ContractData): Promise<Uint8Array<ArrayBufferLike>> {
        try {
            // const dataName = this.determineData(data);
            const pdfDoc = await PDFDocument.load(await fs.readFile(path.resolve('src', 'common', 'services', 'exports', 'docs', 'contract.pdf')));

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
    
    async write(data: string) {
        const pdfDoc = await PDFDocument.create();
        await this.loadFonts(pdfDoc);
        const page = pdfDoc.addPage([600, 400]);
        page.drawText(data, {
            x: 50,
            y: 350,
            size: 14,
            font: this.customFont,
            color: rgb(0, 0, 0)
        });
        return await pdfDoc.save();
    }


    private async loadFonts(pdfDoc: PDFDocument) {
        pdfDoc!.registerFontkit(fontkit);
        this.customFont = await pdfDoc!.embedFont(await fs.readFile(path.resolve('src', 'common', 'services', 'exports', 'fonts', 'Roboto-Regular.ttf')));
    }
    // private determineData(data: Data): DataName {
    //     if (data as ContractData) return "contract";
    //     else if (data as string) return "messages";
    //     else return "unknown";
    // }

    // private async getDoc(dataName: DataName): Promise<PDFDocument | undefined> {
    //     switch (dataName) {
    //         case 'contract': return await PDFDocument.load(await fs.readFile(path.resolve('src', 'common', 'services', 'exports', 'docs', 'contract.pdf')));
    //         case 'messages': return await PDFDocument.load(await fs.readFile(path.resolve('src', 'common', 'services', 'exports', 'docs', 'messages.pdf')));
    //         case 'unknown':  return;
    //     }
    // }

    // private render(dataName: DataName) {
    //     switch (dataName) {
    //         case 'contract': return this.contract();
    //         case 'messages': return this.messages();
    //     }
    // }

    // private contract() {
    //     this.data = this.data as ContractData;
    //     // 1-я страница
    //     this.pages[0]?.drawText(this.data.startDay, {
    //         x: 412,
    //         y: 742,
    //         color: rgb(0, 0, 0),
    //         size: 12,
    //         font: this.customFont
    //     });

    //     this.pages[0]?.drawText(this.data.startMonth, {
    //         x: 442,
    //         y: 742,
    //         color: rgb(0, 0, 0),
    //         size: 12,
    //         font: this.customFont
    //     });

    //     this.pages[0]?.drawText(this.data.startYear, {
    //         x: 513,
    //         y: 742,
    //         color: rgb(0, 0, 0),
    //         size: 12,
    //         font: this.customFont
    //     });

    //     this.pages[0]?.drawText(this.data.startDay, {
    //         x: 272,
    //         y: 438,
    //         color: rgb(0, 0, 0),
    //         size: 12,
    //         font: this.customFont
    //     });

    //     this.pages[0]?.drawText(this.data.startMonth, {
    //         x: 340,
    //         y: 438,
    //         color: rgb(0, 0, 0),
    //         size: 12,
    //         font: this.customFont
    //     });

    //     this.pages[0]?.drawText(this.data.startYear, {
    //         x: 448,
    //         y: 438,
    //         color: rgb(0, 0, 0),
    //         size: 12,
    //         font: this.customFont
    //     });

    //     this.pages[0]?.drawText(this.data.endDay, {
    //         x: 528,
    //         y: 438,
    //         color: rgb(0, 0, 0),
    //         size: 12,
    //         font: this.customFont
    //     });

    //     this.pages[0]?.drawText(this.data.endMonth, {
    //         x: 118,
    //         y: 424,
    //         color: rgb(0, 0, 0),
    //         size: 12,
    //         font: this.customFont
    //     });

    //     this.pages[0]?.drawText(this.data.endYear, {
    //         x: 214,
    //         y: 424,
    //         color: rgb(0, 0, 0),
    //         size: 12,
    //         font: this.customFont
    //     });

    //     // 2-я страница
    //     this.pages[1]?.drawText(this.data.priceNumber, {
    //         x: 128,
    //         y: 616,
    //         color: rgb(0, 0, 0),
    //         size: 12,
    //         font: this.customFont
    //     });

    //     this.pages[1]?.drawText(this.data.priceString, {
    //         x: 302,
    //         y: 616,
    //         color: rgb(0, 0, 0),
    //         size: 12,
    //         font: this.customFont
    //     });

    //     this.pages[1]?.drawText(this.data.priceNumber, {
    //         x: 128,
    //         y: 576,
    //         color: rgb(0, 0, 0),
    //         size: 12,
    //         font: this.customFont
    //     });

    //     this.pages[1]?.drawText(this.data.priceString, {
    //         x: 302,
    //         y: 576,
    //         color: rgb(0, 0, 0),
    //         size: 12,
    //         font: this.customFont
    //     });

    //     this.pages[1]?.drawText(this.data.priceNumber, {
    //         x: 128,
    //         y: 536,
    //         color: rgb(0, 0, 0),
    //         size: 12,
    //         font: this.customFont
    //     });

    //     this.pages[1]?.drawText(this.data.priceString, {
    //         x: 302,
    //         y: 536,
    //         color: rgb(0, 0, 0),
    //         size: 12,
    //         font: this.customFont
    //     });

    //     this.pages[1]?.drawText(this.data.customerName, {
    //         x: 146,
    //         y: 84,
    //         color: rgb(0, 0, 0),
    //         size: 12,
    //         font: this.customFont
    //     });
    // }
}