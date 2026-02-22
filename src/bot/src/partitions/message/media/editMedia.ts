import { MyContext, Markup, func } from '../../imports.js';

export default async function editMedia(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!;
    const queryData = "data" in ctx.callbackQuery! ? ctx.callbackQuery.data : null;

    const messageIndex = Number(queryData!.split(/:/)[1]) || 0;
    const lastMessages = await func.file.readJson(nameDistribution, "resources", "messages");

    if (lastMessages[messageIndex].media.length === 0) {
        
        await ctx.answerCbQuery(`Медиа у ${ctx.session.distribution.call} нет!`, { show_alert: true });
    }
    else {
        ctx.session.state.media.editinigMedia = true;
        ctx.session.typePartition.media.id = messageIndex;
        
        const editMedia = Markup.inlineKeyboard(
            [Markup.button.callback("🔙 Назад", "mainMessage" + nameDistribution)]
        );
    
        const msg = await ctx.editMessageText(func.formatting.escapeMarkdown
            (
                "Изменяем медиа!" +
                `\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → Сообщения → *Редактирование медиа*]`
            ),
            {
                parse_mode: "MarkdownV2",
                ...editMedia
            }
        );
        
        // Сохранение айди для последующего редактирования этого же сообщения
        if (typeof msg !== "boolean" && "message_id" in msg) {
            ctx.session.messageIds.forTextOrMedia = msg.message_id;
        }
    }
};