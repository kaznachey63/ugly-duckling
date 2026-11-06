import db from '@shared/db';
import { Composer, GrammyError } from 'grammy';
import menuView from '@menus/modules/shared/sendout/message/view';
import { ServerManager } from "@common/services/ServerManager";
import type { MyContext } from '@shared/types/SessionData';
import { FileService } from '@common/services/FileService';
import common from '@utils/common';

const mediaComposer = new Composer<MyContext>();

/**
 * Оповещение пользователя о добавлении медиа. Ожидание медиа.
 */
mediaComposer.callbackQuery(/^addMedia:/, async (ctx: MyContext) => {
    if (ctx.session.sendout.mode_active) {
        await common.alertSendoutIsActive(ctx);
        return;
    }

    ctx.session.state.addingMedia = true;
    ctx.session.message = (await db.message.getById(Number(ctx.callbackQuery?.data?.split(':')[1]!.split('#')[1])))!;
    
    const menu = menuView.addMedia(ctx);
    let msg: any;
    try {
        // Сохранение айди для последующего редактирования этого же сообщения
        msg = await ctx.editMessageText(menu.text, { 
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        });
    } catch (error) {
        // 🎯 Перехватываем именно эту ошибку Telegram
        if (error instanceof GrammyError && error.description?.includes("message is not modified")) {
            return;
        }
        throw error;
    }

    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
    }
});

/**
 * Оповещение пользователя об удалении всех медиа
 */
mediaComposer.callbackQuery(/^clearAllMedia:/, async (ctx: MyContext) => {    
    const media = await db.media.get(ctx.session.message.id!);

    if (!media) return;

    // 🔥 УДАЛЯЕМ ФАЙЛЫ ИЗ ФАЙЛОВОЙ СИСТЕМЫ
    for (const file of media!) {
        if (file && file.name !== 'null' && typeof file === 'string') {
            try {
                const fileService = new FileService();
                await fileService.deleteFile(file);
                console.log(`🗑️ Удалён файл: ${file}`);
            } catch (err) {
                console.warn(`Файл не найден: ${file}`);
            }
        }
    }
    
    // 🔥 ОБНУЛЯЕМ МЕДИА В БД
    await db.media.clear(ctx.session.message.id!);
    
    const menu = menuView.clearAllMedia(ctx, await ServerManager.restartProcessOrNot(ctx.session.sendout.name!, true));
    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

export default mediaComposer;