import db from '@shared/db';
import utils from "@utils";
import type { MyContext } from '@shared/types/SessionData';
import menuMessage from '@menus/commands/cabinet/distribution/message/main';

export default async function mainMessage(ctx: MyContext) {
    utils.common.resetSessionStates(ctx.session);
    const queryData = ctx.callbackQuery?.data;
    const nameDistribution = ctx.session.distribution.name!;
    const paginationIndex = Number(queryData!.split(/:/)[1]) || 0;

    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
        
    const menu = menuMessage(ctx, messages, paginationIndex)
    const msg = await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });

    // Сохранение айди для последующего редактирования этого же сообщения
    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.state.idForUpdateMessageFromState = msg.message_id;
    }
}