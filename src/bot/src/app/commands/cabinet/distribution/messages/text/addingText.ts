import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuText from '@menus/commands/cabinet/distribution/message/text';
import { ServerManager } from "@utils/ServerManager";
import common from '@utils/common';

export default async function addingText(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!;

    await db.message.addMessage(nameDistribution, {
        id: 0,
        caption: ctx.message?.text?.trim()!,
        entities: ctx.message?.entities!,
        media: null
    });
    const server = new ServerManager();
    const menu = menuText.adding(ctx, await server.restartProcessOrNot(nameDistribution));
    common.sessionReset(ctx.session);

    await ctx.api.editMessageText(ctx.chatId!, ctx.session.state.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}

// function validateText(params: type) {
    
// }