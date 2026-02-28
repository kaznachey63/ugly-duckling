import type { MyContext } from '@shared/types/SessionData';
import menuText from "@menus/commands/cabinet/distribution/message/text";

export default async function updateText(ctx: MyContext) {
    const queryData = ctx.callbackQuery?.data;

    ctx.session.state.text.updating = true;
    ctx.session.state.text.paginationId = Number(queryData!.split(/:/)[1]) || 0;
    const menu = menuText.update(ctx);

    // Сохранение айди для последующего редактирования этого же сообщения
    const msg = await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });

    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.state.idForUpdateMessageFromState = msg.message_id;
    }
};