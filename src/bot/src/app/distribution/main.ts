import db from "@shared/db";
import utils from "src/common/utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function menuDistribution(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!; 
    const menuDistribution = Markup.inlineKeyboard([
        [Markup.button.callback("📜 Договор", "mainGeneral" + nameDistribution)],
        ...(await db.user.userIsAdmin(ctx.from?.id!) || await db.user.userIsFather(ctx.from?.id!)
            ? [[Markup.button.callback("👥 Чаты", "mainChat" + nameDistribution)]]
            : []
        ),
        [Markup.button.callback("🕰️ График", "mainTime" + nameDistribution)],
        [Markup.button.callback("💬 Сообщения", "mainMessage" + nameDistribution + ":0")],
        [Markup.button.callback("📈 Статистика", "mainStatistika" + nameDistribution)],
        ...(await db.user.userIsAdmin(ctx.from?.id!)
            ? [[Markup.button.callback("🩻 Состояние", "mainService" + nameDistribution)]]
            : []
        ),
        [Markup.button.callback("🔙 Назад", "mainMenu")]
    ]);
    
    await ctx.editMessageText(utils.formatting.escapeMarkdown(
        `📣 Меню рассылки «${ctx.session.distribution.call}»` +
        `\n\n[📍 Путь: Кабинет → *Меню «${ctx.session.distribution.call}»*]`
    ),
    {
        parse_mode: "MarkdownV2",
        ...menuDistribution
    });
}