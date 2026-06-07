import { Composer, InputFile } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import menuExport from '@menus/modules/shared/sendout/schedule/export';
import type { ExportType } from '@shared/types/ExportType';
import { PdfService } from '@common/services/exports/PdfService';
import constants from '@common/constants';
import { WordService } from '@common/services/exports/WordService';
import { FileService } from '@common/services/FileService';
import common from '@utils/common';

const exportComposer = new Composer<MyContext>();

exportComposer.callbackQuery(/^mainExportSchedule:/, async (ctx: MyContext) => {
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

exportComposer.callbackQuery(/^exportSchedule:/, async (ctx: MyContext) => {
    const exportType = ctx.callbackQuery?.data?.split(/-/)[1]! as ExportType;
    let buffer!: Buffer<ArrayBufferLike> | Uint8Array<ArrayBufferLike>;
    let menu;
    let fileName;
    try {
        const schedule = await db.schedule.get(ctx.session.sendout.id!);
        const scheduleBlock = schedule?.map(s => s.label).join('\n');
        const cronBlock = schedule?.map(s => s.cron).join('\n');
        const exportInfo = `─────\nЭкспорт: ${common.getCurrentDate()} | ${common.getCurrentTime()}`;
        const data = ctx.session.isAdmin
            ? `${scheduleBlock}\n\n─────CRON─────\n${cronBlock}\n${exportInfo}`
            : `${scheduleBlock}\n${exportInfo}`
        ;

        switch (exportType) {
            case 'pdf': {
                const pdf = new PdfService();
                buffer = await pdf.write(data!);
                fileName = `${ctx.t("utils.exportFileName.schedule")} ${ctx.t("utils.exportFileName.from")} ${ctx.session.sendout.call}${constants.exportt.extension.pdf}`;
                break;
            }
            case 'word': {
                const word = new WordService();
                buffer = await word.write(data!);
                fileName = `${ctx.t("utils.exportFileName.schedule")} ${ctx.t("utils.exportFileName.from")} ${ctx.session.sendout.call}${constants.exportt.extension.docx}`;
                break;
            }
            case 'txt': {
                const file = new FileService();
                buffer = file.getBuffer(data!);
                fileName = `${ctx.t("utils.exportFileName.schedule")} ${ctx.t("utils.exportFileName.from")} ${ctx.session.sendout.call}${constants.exportt.extension.txt}`
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