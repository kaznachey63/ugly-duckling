import utils from "@utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function addText(ctx: MyContext) {
    ctx.session.state.text.addingText = true;

    const menuAddText = Markup.inlineKeyboard(
        [Markup.button.callback("🔙 Назад", "mainMessage" + ctx.session.distribution.name!)]
    );

    // Сохранение айди для последующего редактирования этого же сообщения
    const msg = await ctx.editMessageText(utils.formatting.escapeMarkdown
        (
            "Добавляем текст!\nПрисылай текст или перешли его сюда. Пачкой текстов нельзя." +
                `\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → Сообщения → *Добавление текста*]`
        ),
        {
            parse_mode: "MarkdownV2",
            ...menuAddText
        }
    );
    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.messageIds.forTextOrMedia = msg.message_id;
    }
};