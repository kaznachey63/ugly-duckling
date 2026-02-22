import db from '@shared/db';
import utils from "@utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function addMedia(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!;
    const queryData = "data" in ctx.callbackQuery! ? ctx.callbackQuery.data : null;
    const positionIndex = Number(queryData!.split(/:/)[1]) || 0;
    const messages = await db.message.getMessagesForBot(nameDistribution);

    if (messages && messages[positionIndex] && messages[positionIndex]?.media?.length === 4) {
        await ctx.answerCbQuery(`Медиа у -${ctx.session.distribution.call}- максимально заполнено!`, { show_alert: true });
    } 
    else {
        ctx.session.state.media.addingMedia = true;
        ctx.session.typePartition.media.id = positionIndex;
    
        const menuAddMedia = Markup.inlineKeyboard(
            [Markup.button.callback("🔙 Назад", "mainMessage" + nameDistribution)]
        );

        // Сохранение айди для последующего редактирования этого же сообщения
        const msg = await ctx.editMessageText(utils.formatting.escapeMarkdown
            (
                "Добавляем медиа! (разрешено хранить: 4шт)" +
                `\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → Сообщения → *Добавление медиа*]`
            ), 
            { 
                parse_mode: "MarkdownV2",
                ...menuAddMedia
            }
        );
        if (typeof msg !== "boolean" && "message_id" in msg) {
            ctx.session.messageIds.forTextOrMedia = msg.message_id;
        }
    }
};