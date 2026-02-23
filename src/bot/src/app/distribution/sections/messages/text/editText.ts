import utils from "src/common/utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function editText(ctx: MyContext) {
    const queryData = "data" in ctx.callbackQuery! ? ctx.callbackQuery.data : null;

    ctx.session.state.text.editingText = true;
    ctx.session.typePartition.text.id = Number(queryData!.split(/:/)[1]) || 0;
    
    const menuEditText = Markup.inlineKeyboard(
        [Markup.button.callback("🔙 Назад", "mainMessage" + ctx.session.distribution.name!)]
    );
    
    // Сохранение айди для последующего редактирования этого же сообщения
    const msg = await ctx.editMessageText(utils.formatting.escapeMarkdown
        (
            "Изменяем текст!\nПрисылай текст или перешли его сюда. Пачкой текстов нельзя." +
            `\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → Сообщения → *Изменение текста*]`
        ),
        {
            parse_mode: "MarkdownV2",
            ...menuEditText
        }
    );    
    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.messageIds.forTextOrMedia = msg.message_id;
    }
};