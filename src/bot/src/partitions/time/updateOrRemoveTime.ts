import db from '@shared/db/index.js';
import utils from "@utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function updateOrRemoveTime(ctx: MyContext) {
    const queryData = "data" in ctx.callbackQuery! ? ctx.callbackQuery.data : null;
    const nameDistribution = ctx.session.distribution.name!;
    const timeId = Number(queryData!.split(/:/)[1]);
    ctx.session.typePartition.time.id = timeId;
    const targetTime = utils.local.formatTimeToRu(await db.time.getTime(ctx.session.distribution.schema, timeId));
    const menuButtons = Markup.inlineKeyboard([
        [
            Markup.button.callback("✍ Изменить", `editTime${nameDistribution}`),
            Markup.button.callback("🗑 Удалить", `removeTime${nameDistribution}`),
        ],
        [Markup.button.callback("🔙 Назад", `mainTime${nameDistribution}`)]
    ]);

    await ctx.editMessageText(utils.formatting.escapeMarkdown
        (
            `Выбранное время → ${targetTime}.\n` +
            "Нажми на кнопку, чтобы произвести соответсвующее действие." + 
            `\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → График → *Выбор действия*]`
        ),
        {
            reply_markup: menuButtons.reply_markup,
            parse_mode: "MarkdownV2"
        }
    );
}