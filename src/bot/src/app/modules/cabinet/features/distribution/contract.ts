import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import { GoogleService } from "src/common/services/GoogleService";
import menuContract from '@menus/modules/cabinet/distribution/contract';
import constants from '@constants';
import { PDFDocument } from 'pdf-lib';
import { fileURLToPathBuffer, pathToFileURL } from 'node:url';
import fetch from 'node-fetch';

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
    const exportType = ctx.callbackQuery?.data?.split(/-/)[1]!;
    try {
        switch (exportType) {
            case 'pdf':
                const response = await fetch(pathToFileURL('./dogovor.pdf'));
                const buffer = Buffer.from(await response.arrayBuffer());
                const pdfDoc = await PDFDocument.load(buffer);
                console.log(pdfDoc.getPageCount());
                
                break;
        
            default:
                break;
        }
    } catch {
        
    }
});

export default contractComposer;