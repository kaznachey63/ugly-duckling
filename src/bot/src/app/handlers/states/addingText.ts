import db from '@shared/db';
import type { MyContext } from '@shared/types/SessionData';
import menuState from '@menus/handlers/states';
import { ServerManager } from "src/common/services/ServerManager";
import common from '@utils/common';

export default async function addingText(ctx: MyContext) {
    let menu;
    if (!validateText(ctx.message?.text?.trim()!)) {
        menu = menuState.addingText(ctx, false, false);
    }
    else {
        await db.message.create(ctx.session.sendout.schema, {
            id: 0,
            caption: ctx.message?.text?.trim()!,
            entities: ctx.message?.entities!,
            media: null
        });
        const server = new ServerManager();
        menu = menuState.addingText(ctx, await server.restartProcessOrNot(ctx.session.sendout.name, true), true);
        common.resetSessionStates(ctx.session);
    }
   
    await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}

function validateText(text: string): boolean {
    return typeof text === 'string' && text.trim().length > 0;
}