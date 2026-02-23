import utils from "src/common/utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function selectiveStatistika(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name;

    const text = utils.formatting.escapeMarkdown(
        "Выберите тип Сравнительной статистики." +
        `\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → Статистика → *Сравнительная*]`
    );

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback("Неделя", `comparativeStatistikaWeek${nameDistribution}`),
        Markup.button.callback("Месяц", `comparativeStatistikaMonth${nameDistribution}`)],
        [Markup.button.callback("🔙 Назад", `mainStatistika${nameDistribution}`)]
    ]);

    try {
        await ctx.editMessageText(text, {
            parse_mode: "MarkdownV2",
            reply_markup: keyboard.reply_markup
        });
    } catch (error) {
        try { await ctx.deleteMessage(); } catch (_) { }
        await ctx.reply(text, {
            parse_mode: "MarkdownV2",
            reply_markup: keyboard.reply_markup
        });
    }
}
