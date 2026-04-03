import { Composer, InputFile } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import { GoogleService } from "src/common/services/GoogleService";
import menuContract from '@menus/modules/cabinet/distribution/contract';
import constants from '@constants';
import { PdfService } from 'src/common/services/render/PdfService';
import { WordService } from 'src/common/services/render/WordService';
import type { ExportType } from '@shared/types/ExportType';

const contractComposer = new Composer<MyContext>();

contractComposer.callbackQuery(/^mainContract:/, async (ctx: MyContext) => {
    try {
        const google = new GoogleService();
        const dataFromSheets = await google.getRowsFromGS(constants.google.rangeTable);
        const row = dataFromSheets?.find(r => r?.[0] === ctx.session.distribution.label);

        let menu;
        if (!row || row.length < 4) {
            menu = menuContract.main(ctx, true);
        }
        else {
            const [, customer, dateStart, dateStop] = row as [undefined, string, string, string];
            menu = menuContract.main(ctx, { customer, dateStart, dateStop }, false);
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
    const exportType = ctx.callbackQuery?.data?.split(/-/)[1]! as ExportType;
    let buffer!: Buffer<ArrayBufferLike> | Uint8Array<ArrayBufferLike>;

    const contractData = {
        startDay: "03",
        startMonth: "04",
        startYear: "26",
        customerName: "Заказчик 3.3",
        endDay: "33",
        endMonth: "04",
        endYear: "26",
        priceNumber: "2000",
        priceString: "две тысячи",
    };
    
    let menu;
    try {
        switch (exportType) {
            case 'pdf': {
                const pdf = new PdfService();
                buffer = await pdf.execRender(contractData);
                break;
            }
            case 'word': {
                const word = new WordService();
                buffer = await word.execRender(contractData);
                break;
            }
        }
        menu = menuContract.exportContract(ctx, exportType, true);
        await ctx.replyWithDocument(
            new InputFile(Buffer.from(buffer)),
            { caption: menu.text, reply_markup: menu.keyboard }
        );
    } catch(error) {
        console.error("Ошибка при экспорте: ", error);
        menu = menuContract.exportContract(ctx, exportType, false);
        await ctx.reply(menu.text, { 
            reply_markup: menu.keyboard 
        });
    }
});

export default contractComposer;