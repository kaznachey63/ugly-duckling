import db from "@shared/db";
import utils from "@utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function editingText(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!;
    const positionIndex = ctx.session.typePartition.text.id!;
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
    const messageId = messages[positionIndex]?.id!;
    const menuEditingText = Markup.inlineKeyboard(
        [Markup.button.callback("🔙 Назад", "mainMessage" + nameDistribution)]
    );

    // if (typeof utils.formatting.checkMD(ctx.message) == 'string') {
    //     await ctx.reply(utils.formatting.checkMD(ctx.message).toString(), menuEditingText);
    //     return;
    // }
    // const userMessage = utils.formatting.setMD(ctx) ?? ctx.text?.trim();

    let textMessage: string = "";
    if (!String(nameDistribution)) { //|| !Number(messageId) || !String(userMessage)) {
        textMessage = "❌ Текст не изменен!\nОбратитесь к администратору";
    }
    else {
        await db.message.updateMessage(nameDistribution, messageId, {
            caption: ctx.text?.trim()!, 
            entities: 'entities' in ctx.message! ? ctx.message.entities : null,
        });

        if (await utils.server.reloadService(nameDistribution)) {
            textMessage = "✅ Текст изменен!";
        }
        else {
            textMessage = "❌ Текст не изменен!\nОбратитесь к администратору";
        }
    }

    textMessage += `\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → Сообщения → *Изменение текста*]`;

    try {
        await ctx.telegram.editMessageText(
            ctx?.chat?.id, // chat_id
            ctx.session.messageIds.forTextOrMedia, // message_id
            undefined, // inline_message_id
            utils.formatting.escapeMarkdown(textMessage),
            { parse_mode: "MarkdownV2", reply_markup: menuEditingText.reply_markup }
        );
    } catch (error) {
        await ctx.reply(utils.formatting.escapeMarkdown(textMessage), menuEditingText)
    }
}