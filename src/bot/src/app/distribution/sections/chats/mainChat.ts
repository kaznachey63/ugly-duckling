import db from "@shared/db";
import utils from "src/common/utils";
import type { MyContext } from '@shared/types/SessionData';

export default async function mainChat(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!;
    const logsBaza = await db.result.getResults(nameDistribution);
    if (!logsBaza) return;

    const lastLog = logsBaza.at(-1)!;
    const infoChat = await db.chat.getChatsInfo(lastLog?.chats);
    console.log(infoChat);
    
    if (logsBaza.length === 0 || !lastLog?.chats) {
        // ✅ Показываем alert, если рассылки нет
        await ctx.answerCbQuery(`Рассылка у -${ctx.session.distribution.call}- еще не произошла!`, { show_alert: true });
        return;
    }

    // Создаем клавиатуру
    const menuChat = Markup.inlineKeyboard([
        ...infoChat.map((c: any) => [Markup.button.url(c.title, c.link)]),
        [Markup.button.callback("🔙 Назад", "menuDistribution" + nameDistribution)]
    ]);

    await ctx.editMessageText(utils.formatting.escapeMarkdown(
        `Количество: ${lastLog.success}` +
        `\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → *Чаты*]`), 
        {
            parse_mode: "MarkdownV2",
            reply_markup: menuChat.reply_markup
        }
    );
}
