import db from '@shared/db/index.js';
import utils from "src/common/utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function removeAllTime(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!;
    let textMessage = "";

    if (!String(nameDistribution)) {
        textMessage = "❌ График не очищен!\nОбратитесь к администратору";
    }
    else {
        await db.time.clearTableTimes(ctx.session.distribution.schema);

        if (await utils.server.reloadService(nameDistribution)) {
            textMessage = "✅ График очищен!";
        }
        else {
            textMessage = "❌ График не очищен!\nОбратитесь к администратору";
        }
    }

    textMessage += `\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → График → *Очистка графика*]`
    const menuRemoveAllTime = Markup.inlineKeyboard(
        [Markup.button.callback("🔙 Назад", `mainTime${nameDistribution}`)]
    );

    await ctx.editMessageText(utils.formatting.escapeMarkdown(textMessage), {
        parse_mode: "MarkdownV2", 
        reply_markup: menuRemoveAllTime.reply_markup
    });
}