import type { MyContext } from '@shared/types/SessionData';
import menuExport from "@menus/modules/shared/contract/export";
import { Composer, InputFile } from "grammy";
import type { ExportType } from "@shared/types/ExportType";
import { PdfService } from "@common/services/exports/PdfService";
import { WordService } from "@common/services/exports/WordService";
import type { Contract } from "@shared/types/DB";
import type { ContractExport } from "@shared/types/ContractExport";
import constants from '@common/constants';

const exportComposer = new Composer<MyContext>();

/**
 * Выбор формата экспорта
 */
exportComposer.callbackQuery(/^mainExportContract#/, async (ctx: MyContext) => {
    const menu = menuExport.main(ctx);
    await ctx.editMessageText(menu.text, {
        parse_mode: 'MarkdownV2',
        reply_markup: menu.keyboard
    });
});

/**
 * Экспорт договора в выбранный формат
 */
exportComposer.callbackQuery(/^exportContract#/, async (ctx: MyContext) => {   
    const exportType = ctx.callbackQuery?.data?.split(/-/)[1]! as ExportType;
    let buffer!: Buffer<ArrayBufferLike> | Uint8Array<ArrayBufferLike>;

    const contractData = dataForExport(ctx.session.contract);
    
    let menu;
    let fileName;

    try {
        switch (exportType) {
            case 'pdf': {
                const pdf = new PdfService();
                buffer = await pdf.execRender(contractData);
                fileName = `${constants.exportt.fileName.contract.name} ${constants.exportt.fileName.contract.name} ${new Date(ctx.session.contract.date_start!).toLocaleDateString('ru-RU')}${constants.exportt.extension.pdf}`;
                break;
            }
            case 'word': {
                const word = new WordService();
                buffer = await word.execRender(contractData);
                fileName = `${constants.exportt.fileName.contract.name} ${constants.exportt.fileName.contract.name} ${new Date(ctx.session.contract.date_start!).toLocaleDateString('ru-RU')}${constants.exportt.extension.docx}`;
                break;
            }
        }
        menu = menuExport.action(ctx, exportType, true);
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
        menu = menuExport.action(ctx, exportType, false);
        await ctx.editMessageText(menu.text, { 
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard 
        });
    }
});

/**
 * Формирование данных для экспорта договора
 */
function dataForExport(contract: Contract): ContractExport {
    const start = new Date(contract.date_start!);
    const end = new Date(contract.date_end!);

    return {
        startDay: String(start.getDate()).padStart(2, '0'),
        startMonth: String(start.getMonth() + 1).padStart(2, '0'),
        startYear: String(start.getFullYear()).slice(-2),
        customerName: contract.user!.name!,
        endDay: String(end.getDate()).padStart(2, '0'),
        endMonth: String(end.getMonth() + 1).padStart(2, '0'),
        endYear: String(end.getFullYear()).slice(-2),
        priceNumber: String(contract.price),
        priceString: contract.price_text!
    };
}

export default exportComposer;