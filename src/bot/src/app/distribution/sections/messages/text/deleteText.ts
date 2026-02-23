import utils from "src/common/utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';
import db from '@shared/db';

export default async function deleteText(ctx: MyContext) {    
    const queryData = "data" in ctx.callbackQuery! ? ctx.callbackQuery.data : null;
    const nameDistribution = ctx.session.distribution.name!;
    const positionIndex = Number(queryData!.split(/:/)[1]) || 0;
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
    const messageId = messages[positionIndex]?.id!;

    let textMessage: string = "";
    if (!String(nameDistribution) || !Number(messageId)) {
        textMessage = "❌ Текст не удален!\nОбратитесь к администратору";
    }
    else {
        await db.message.removeMessage(nameDistribution, messageId);

        if (await utils.server.reloadService(nameDistribution)) {
            textMessage = "✅ Текст удален!";
        }
        else {
            textMessage = "❌ Текст не удален!\nОбратитесь к администратору";
        }
    }

    textMessage += `\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → Сообщения → *Удаление текста*]`
    const menuDeleteText = Markup.inlineKeyboard(
        [Markup.button.callback("🔙 Назад", "mainMessage" + nameDistribution)]
    );

    try {
        await ctx.telegram.editMessageText(
            ctx?.chat?.id, // chat_id
            ctx.session.messageIds.forTextOrMedia, // message_id
            undefined, // inline_message_id
            utils.formatting.escapeMarkdown(textMessage),
            { parse_mode: "MarkdownV2", reply_markup: menuDeleteText.reply_markup }
        );
    } catch (error) {
        await ctx.reply(utils.formatting.escapeMarkdown(textMessage), menuDeleteText)
    }
};