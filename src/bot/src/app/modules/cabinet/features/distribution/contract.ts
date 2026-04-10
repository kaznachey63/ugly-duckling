import { Composer, InputFile } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import { GoogleService } from "src/common/services/GoogleService";
import menuContract from '@menus/modules/cabinet/distribution/contract';
import constants from '@constants';
import { PdfService } from 'src/common/services/render/PdfService';
import { WordService } from 'src/common/services/render/WordService';
import type { ExportType } from '@shared/types/ExportType';
import type { ContractData } from '@shared/types/ContractData';

const contractComposer = new Composer<MyContext>();

contractComposer.callbackQuery(/^mainContract:/, async (ctx: MyContext) => {
    if (ctx.session.distribution.call == "Пусто") {
        await ctx.answerCallbackQuery({ text: ctx.t("commands.cabinet.distribution.contract.main.notSuccess"), show_alert: true });
        return;
    }
    
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

        try {
            const msg = await ctx.editMessageText(menu.text, {
                parse_mode: 'MarkdownV2',
                reply_markup: menu.keyboard
            });

            // Сохранение айди для последующего редактирования этого же сообщения
            if (typeof msg !== "boolean" && "message_id" in msg) {
                ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
            }
        } catch {
            await ctx.api.deleteMessage(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState);
            const msg = await ctx.reply(menu.text, {
                parse_mode: 'MarkdownV2',
                reply_markup: menu.keyboard
            });

            // Сохранение айди для последующего редактирования этого же сообщения
            if (typeof msg !== "boolean" && "message_id" in msg) {
                ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
            }
        }
    } catch (error) {
        console.error('Ошибка в mainContract:', error);
    }
});

contractComposer.callbackQuery(/^mainExportContract:/, async (ctx: MyContext) => {
    const menu = menuContract.mainExportContract(ctx);
    await ctx.editMessageText(menu.text, {
        parse_mode: 'MarkdownV2',
        reply_markup: menu.keyboard
    });
});

contractComposer.callbackQuery(/^exportContract:/, async (ctx: MyContext) => {   
    const exportType = ctx.callbackQuery?.data?.split(/-/)[1]! as ExportType;
    let buffer!: Buffer<ArrayBufferLike> | Uint8Array<ArrayBufferLike>;

    const contractData = await dataFromGSForExport(ctx.session.distribution.label);
    
    let menu;
    let fileName;

    try {
        switch (exportType) {
            case 'pdf': {
                const pdf = new PdfService();
                buffer = await pdf.execRender(contractData);
                fileName = "contract.pdf";
                break;
            }
            case 'word': {
                const word = new WordService();
                buffer = await word.execRender(contractData);
                fileName = "contract.docx";
                break;
            }
        }
        menu = menuContract.exportContract(ctx, exportType, true);
        await ctx.api.deleteMessage(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState);
        const msg = await ctx.replyWithDocument(new InputFile(Buffer.from(buffer), fileName), { 
            caption: menu.text, 
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard 
        });

        // Сохранение айди для последующего редактирования этого же сообщения
        if (typeof msg !== "boolean" && "message_id" in msg) {
            ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
        }
    } catch(error) {
        console.error("Ошибка при экспорте: ", error);
        menu = menuContract.exportContract(ctx, exportType, false);
        await ctx.editMessageText(menu.text, { 
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard 
        });
    }
});

async function dataFromGSForExport(distributionLabel: string): Promise<ContractData> {
    const google = new GoogleService();
    const dataFromSheets = await google.getRowsFromGS(constants.google.rangeTable);
    const row = dataFromSheets?.find(r => r?.[0] === distributionLabel);
    
    const [ startDay, startMonth, startYear ] = row![2]!.split('.');
    const [ endDay, endMonth, endYear ] = row![3]!.split('.');
    
    return {
        startDay: startDay!,
        startMonth: startMonth!,
        startYear: startYear!,
        customerName: row![1]!,
        endDay: endDay!,
        endMonth: endMonth!,
        endYear: endYear!,
        priceNumber: row![6]!,
        priceString: "две тысячи",
    };
}

export default contractComposer;