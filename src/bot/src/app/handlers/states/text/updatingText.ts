import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuText from '@menus/commands/cabinet/distribution/message/text';
import { ServerManager } from "@utils/ServerManager";
import common from '@utils/common';

export default async function editingText(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!;
    const positionId = ctx.session.state.text.positionId!;
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
    const messageId = messages[positionId]?.id!;

    await db.message.updateMessage(nameDistribution, messageId, {
        caption: ctx.message?.text?.trim()!,
        entities: ctx.message?.entities!,
    });

    const server = new ServerManager();
    const menu = menuText.updating(ctx, await server.restartProcessOrNot(nameDistribution, true));
    common.resetSessionStates(ctx.session);
    
    await ctx.api.editMessageText(ctx.chatId!, ctx.session.state.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}