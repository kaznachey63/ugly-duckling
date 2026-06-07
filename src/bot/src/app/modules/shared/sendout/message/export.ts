import type { MyContext } from '@shared/types/SessionData';
import menuExport from '@menus/modules/shared/sendout/message/export';
import { Composer, InputFile } from 'grammy';
import type { ExportType } from '@shared/types/ExportType';
import { PdfService } from '@common/services/exports/PdfService';
import { WordService } from '@common/services/exports/WordService';
import { FileService } from '@common/services/FileService';
import db from '@shared/db';
import constants from '@common/constants';
import common from '@utils/common';
const exportComposer = new Composer<MyContext>();

exportComposer.callbackQuery(/^mainExportMessages:/, async (ctx: MyContext) => {
    const menu = menuExport.main(ctx);
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
});

exportComposer.callbackQuery(/^exportMessages:/, async (ctx: MyContext) => {
    const exportType = ctx.callbackQuery?.data?.split(/-/)[1]! as ExportType;
    let buffer!: Buffer<ArrayBufferLike> | Uint8Array<ArrayBufferLike>;
    let menu;
    let fileName;
    try {
        const exportInfo = `─────\n${ctx.t("utils.export.text")}: ${common.getCurrentDate()} | ${common.getCurrentTime()}`;

        const messages = await db.message.getMessages(ctx.session.sendout.id!);

        const data = `${messages!
            .map((m, i) => `${ctx.t("modules.shared.sendout.view.message.view.main.messageNumber", {number: i + 1})}\n${m.caption}`)
            .join('\n\n')}\n${exportInfo}`
        ;
        switch (exportType) {
            case 'pdf': {
                const pdf = new PdfService();
                buffer = await pdf.write(data);
                fileName = `${ctx.t("utils.export.fileName.message")} ${ctx.t("utils.export.from")} ${ctx.session.sendout.call}${constants.exportt.extension.pdf}`;
                break;
            }
            case 'word': {
                const word = new WordService();
                buffer = await word.write(data);
                fileName = `${ctx.t("utils.export.fileName.message")} ${ctx.t("utils.export.from")} ${ctx.session.sendout.call}${constants.exportt.extension.docx}`;
                break;
            }
            case 'txt': {
                const file = new FileService();
                buffer = file.getBuffer(data);
                fileName = `${ctx.t("utils.export.fileName.message")} ${ctx.t("utils.export.from")} ${ctx.session.sendout.call}${constants.exportt.extension.txt}`
                break;
            }
        }

        menu = menuExport.result(ctx, exportType, true);
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
    } catch (error) {
        console.error("Ошибка при экспорте: ", error);
        menu = menuExport.result(ctx, exportType, false);
        await ctx.editMessageText(menu.text, { 
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard 
        });
    }
});

export default exportComposer;