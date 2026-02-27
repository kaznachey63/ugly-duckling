import type { MyContext } from '@shared/types/SessionData';
import menuSchedule from '@menus/commands/cabinet/distribution/sections/schedule';

/**
 * Уведомление о добавлении времени. Ожидание "времени".
 */
export default async function addTime(ctx: MyContext) {
    ctx.session.state.time.addingTime = true;
    const menu = menuSchedule.add(ctx);

    const msg = await ctx.editMessageText(menu.text,
        {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        }
    );

    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.messageIds.forTime = msg.message_id;
    }
};