import { Composer, InputFile } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import { GoogleService } from "src/common/services/GoogleService";
import menuContract from '@menus/modules/cabinet/distribution/contract';
import constants from '@constants';
import { PDFDocument, rgb } from 'pdf-lib';
import path from 'node:path';
import fs from 'fs/promises'

const contractComposer = new Composer<MyContext>();

contractComposer.callbackQuery(/^mainContract:/, async (ctx: MyContext) => {
    try {
        const google = new GoogleService();
        const dataFromSheets = await google.getRowsFromGS(constants.google.rangeTable);
        const row = dataFromSheets?.find(r => r?.[0] === ctx.session.distribution.label);

        let menu;
        if (!row || row.length < 4) {
            menu = menuContract(ctx, true);
        }
        else {
            const [, customer, dateStart, dateStop] = row as [undefined, string, string, string];
            menu = menuContract(ctx, { customer, dateStart, dateStop }, false);
        }

        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в mainContract:', error);
    }
});

contractComposer.callbackQuery(/^exportContract:/, async (ctx: MyContext) => {
    console.log("мф здесь");
    
    const exportType = ctx.callbackQuery?.data?.split(/-/)[1]!;
    console.log(exportType);
    
    try {
        switch (exportType) {
            case 'pdf': {
                const filePath = path.resolve('src', 'app', 'modules', 'cabinet', 'features', 'distribution', 'dogovor.pdf');

                try {
                    const pdfDoc = await PDFDocument.load(await fs.readFile(filePath));
                    // const pages = pdfDoc.getPages();

                    // if (pages.length > 0) {
                    //     pages[0]?.drawText('sdfgrhtuyjnhbgfdsadf', {
                    //         x: 50,
                    //         y: 100,
                    //         color: rgb(0, 0.53, 0.71),
                    //         size: 12,
                    //     });
                    // }

                    // const modifiedPdf = await pdfDoc.save();

                    const form = pdfDoc.getForm()
                    const fields = form.getFields()

                    console.log(`Found ${fields.length} fields:`)
                    fields.forEach(field => {
                        const name = field.getName()
                        const type = field.constructor.name
                        console.log(`- ${name} (${type})`)
                    })

                    // await ctx.replyWithDocument(
                    //     new InputFile(Buffer.from(modifiedPdf))
                    // );

                    await ctx.answerCallbackQuery('Готово');
                } catch (err: any) {
                    console.log('Ошибка:', err.code, err.message);
                    await ctx.answerCallbackQuery('Ошибка: ' + err.code);
                }
                break;
            }
            default:
                break;
        }
    } catch {
        
    }
});

export default contractComposer;