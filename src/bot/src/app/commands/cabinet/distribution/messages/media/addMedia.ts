import type { MyContext } from '@shared/types/SessionData';
import menuMedia from "@menus/commands/cabinet/distribution/message/media";

/**
 * Оповещение пользователя о добавлении медиа. Ожидание медиа.
 */
export default async function addMedia(ctx: MyContext) {
    const queryData = ctx.callbackQuery?.data;
    const positionIndex = Number(queryData!.split(/:/)[1]) || 0;

    ctx.session.state.media.addingMedia = true;
    ctx.session.typePartition.media.id = positionIndex;

    const menu = menuMedia.add(ctx);

    // Сохранение айди для последующего редактирования этого же сообщения
    const msg = await ctx.editMessageText(menu.text, { 
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });

    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.messageIds.forTextOrMedia = msg.message_id;
    }
};