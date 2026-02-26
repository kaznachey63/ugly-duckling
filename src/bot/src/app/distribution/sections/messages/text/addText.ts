import type { MyContext } from '@shared/types/SessionData';
import menuText from "@menus/distribution/sections/message/text";

export default async function addText(ctx: MyContext) {
    ctx.session.state.text.addingText = true;
    const menu = menuText.add(ctx);

    // Сохранение айди для последующего редактирования этого же сообщения
    const msg = await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        }
    );

    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.messageIds.forTextOrMedia = msg.message_id;
    }
};