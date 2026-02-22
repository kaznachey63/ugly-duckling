import db from "@shared/db";
import utils from "@utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function addingText(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!;
    const menuAddingText = Markup.inlineKeyboard(
        [Markup.button.callback("🔙 Назад", "mainMessage" + nameDistribution)]
    );

    // if (typeof utils.formatting.checkMD(ctx.message) == 'string') {
    //     await ctx.reply(utils.formatting.checkMD(ctx.message).toString(), menuAddingText);
    //     return;
    // }
    
    // const userMessage = utils.formatting.setMD(ctx) ?? ctx.text?.trim();

    let textMessage: string = "";
    if (!String(nameDistribution)) { //| !String(userMessage)) {
        textMessage = "❌ Текст не сохранен!\nОбратитесь к администратору";
    }
    else {
        await db.message.addMessage(nameDistribution, {
            id: 0,
            caption: ctx.text?.trim()!,
            entities: 'entities' in ctx.message! ? ctx.message.entities : null,
            media: null
        });
        
        if (await utils.server.reloadService(nameDistribution)) {
            textMessage = "✅ Текст сохранен!";
        }
        else {
            textMessage = "❌ Текст не сохранен!\nОбратитесь к администратору";
        }
    }

    textMessage += `\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → Сообщения → *Добавление текста*]`;

    try {
        await ctx.telegram.editMessageText(
            ctx?.chat?.id, // chat_id
            ctx.session.messageIds.forTextOrMedia, // message_id
            undefined, // inline_message_id
            utils.formatting.escapeMarkdown(textMessage),
            { parse_mode: "MarkdownV2", reply_markup: menuAddingText.reply_markup }
        );
    } catch (error) {
        await ctx.reply(utils.formatting.escapeMarkdown(textMessage), menuAddingText)
    }
}