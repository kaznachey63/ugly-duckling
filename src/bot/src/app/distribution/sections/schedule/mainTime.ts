import db from '@shared/db/index.js';
import utils from "src/common/utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function mainTime(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!;
    const times = await db.time.getTimesForBot(nameDistribution);
    let menuButtons: any[] = [];
    let textMessage = "";
    
    if (!times?.length) {
        textMessage += `Графика у ${ctx.session.distribution.call} нет!` ;
    }
    else {
        textMessage += "График рассылки представлен ниже в виде кнопок";

        for (const time of times) {
            menuButtons.push([
                Markup.button.callback(utils.local.formatTimeToRu(time)!, `updateOrRemoveTime${nameDistribution}:${time.id}`)
            ]);
        }
    }

    if (await db.user.userIsAdmin(ctx.from?.id!)) {
        menuButtons.push(
            [Markup.button.callback("⬇ Параметры графика ⬇", "parametrsTime")],
            [
                Markup.button.callback("⏰ Добавить время", `addTime${nameDistribution}`, times?.length! >= 6),
                Markup.button.callback("🗑 Очистить", `removeAllTime${nameDistribution}`, !times?.length)
            ]
        );
    }

    menuButtons.push([
        Markup.button.callback("🔙 Назад", `menuDistribution${nameDistribution}`)
    ]);

    // Отправка сообщения с клавиатурой
    const msg = await ctx.editMessageText(utils.formatting.escapeMarkdown
        (
            textMessage + `\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → *Время*]`
        ),
        {
            ...Markup.inlineKeyboard(menuButtons),
            parse_mode: "MarkdownV2"
        }
    );
}