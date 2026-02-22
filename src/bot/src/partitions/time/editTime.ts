import utils from "@utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function editTime(ctx: MyContext) {
    const queryData = "data" in ctx.callbackQuery! ? ctx.callbackQuery.data : null;

    ctx.session.state.time.editinigTime = true;
    ctx.session.typePartition.time.id = Number(queryData!.split(/:/)[1]?.split(/:/)[1]);

    const menuEditTime = Markup.inlineKeyboard(
        [Markup.button.callback("🔙 Назад", "maintime" + ctx.session.distribution.name!)]
    );

    // Сохранение айди для последующего редактирования этого же сообщения
    const msg = await ctx.editMessageText(utils.formatting.escapeMarkdown
        (`Изменяем время!\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → График → *Изменение времени*]`),
        {
            parse_mode: "MarkdownV2",
            ...menuEditTime
        }
    );
    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.messageIds.forTime = msg.message_id;
    }
};