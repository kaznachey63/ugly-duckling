import utils from "src/common/utils";
import type { MyContext } from '@shared/types/SessionData';
import menuSchedule from '@menus/commands/cabinet/distribution/schedule';

/**
 * Уведомление об изменении времени. Ожидание "времени".
 */
export default async function updateTime(ctx: MyContext) {
    ctx.session.state.time.updatingTime = true;
    const menu = menuSchedule.update(ctx);

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