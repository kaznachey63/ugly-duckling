import utils from "src/common/utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function addTime(ctx: MyContext) {
    ctx.session.state.time.addingTime = true;

    const menuAddTime = Markup.inlineKeyboard(
        [Markup.button.callback("🔙 Назад", "mainTime" + ctx.session.distribution.name!)]
    );

    // Сохранение айди для последующего редактирования этого же сообщения
    const msg = await ctx.editMessageText(utils.formatting.escapeMarkdown
        (`Добавляем время!\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → График → *Добавление времени*]`),
        {
            parse_mode: "MarkdownV2",
            ...menuAddTime
        }
    );
    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.messageIds.forTime = msg.message_id;
    }
};