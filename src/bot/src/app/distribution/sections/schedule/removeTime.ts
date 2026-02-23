import db from '@shared/db/index.js';
import utils from "src/common/utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function removeTime(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!;
    let textMessage = "";

    if (!String(nameDistribution)) {
        textMessage = "❌ Текст не удален!\nОбратитесь к администратору";
    }
    else {
        await db.time.removeTime(ctx.session.distribution.schema, ctx.session.typePartition.time.id);

        if (await utils.server.reloadService(nameDistribution)) {
            textMessage = "✅ Время удалено!";
        }
        else {
            textMessage = "❌ Время не удалено!\nОбратитесь к администратору";
        }
    }

    textMessage += `\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → График → Выбор действия → *Удаление времени*]`
    const menuRemoveTime = Markup.inlineKeyboard(
        [Markup.button.callback("🔙 Назад", `mainTime${nameDistribution}`)]
    );

    await ctx.editMessageText(utils.formatting.escapeMarkdown(textMessage), {
        parse_mode: "MarkdownV2", 
        reply_markup: menuRemoveTime.reply_markup
    });
}