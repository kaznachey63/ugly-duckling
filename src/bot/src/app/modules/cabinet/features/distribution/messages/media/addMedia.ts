import type { MyContext } from '@shared/types/SessionData';
import menuMedia from "@menus/commands/cabinet/distribution/message/media";
import { GrammyError } from 'grammy';

/**
 * Оповещение пользователя о добавлении медиа. Ожидание медиа.
 */
export default async function addMedia(ctx: MyContext) {
    const queryData = ctx.callbackQuery?.data;
    const positionIndex = Number(queryData!.split(/:/)[1]) || 0;

    ctx.session.state.media.adding = true;
    ctx.session.state.media.paginationId = positionIndex;

    const menu = menuMedia.add(ctx);
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
        ctx.session.state.idForUpdateMessageFromState = msg.message_id;
    }
};