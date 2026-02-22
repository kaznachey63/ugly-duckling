import utils from "@utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function mainStatistika(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name;
    // if (nameDistribution.toLowerCase() == "valera") {
    //     await ctx.answerCbQuery(`Просмотр статистики доступен в других пакетах рассылки`, { show_alert: true });
    // } 
    // else {
        // await ctx.editMessageText("Выбери день и посмотри сводку результатов!", result);
        await ctx.editMessageText(utils.formatting.escapeMarkdown
            (
                "Выберите формат желаемой статистики." +
                `\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → *Статистика*]`
            ), 
            {
                parse_mode: "MarkdownV2",
                ...Markup.inlineKeyboard([
                    [Markup.button.callback("📅 Выборочная", `selectiveStatistika${nameDistribution}`),
                    Markup.button.callback("📊 Сравнительная", `comparativeStatistika${nameDistribution}`)],
                    [Markup.button.callback("🔙 Назад", `menuDistribution${nameDistribution}`)],
                ])
            }
        ); 
    // }
}