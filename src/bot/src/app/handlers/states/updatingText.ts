import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuState from '@menus/handlers/states';
import { ServerManager } from "src/common/services/ServerManager";
import common from '@utils/common';

export default async function editingText(ctx: MyContext) {
    const positionId = ctx.session.other.text.positionId!;
    const messages = await db.message.getMessagesForBot(ctx.session.distribution.schema);
    if (!messages) return;
    const messageId = messages[positionId]?.id!;

    await db.message.updateMessage(ctx.session.distribution.schema, messageId, {
        caption: ctx.message?.text?.trim()!,
        entities: ctx.message?.entities!,
    });

    const server = new ServerManager();
    const menu = menuState.updatingText(ctx, await server.restartProcessOrNot(ctx.session.distribution.name, true));
    common.resetSessionStates(ctx.session);
    
    await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}