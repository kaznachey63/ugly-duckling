import db from '@shared/db';
import type { MyContext } from '@shared/types/SessionData';
import menuState from '@menus/handlers/states';
import { ServerManager } from "src/common/services/ServerManager";
import common from '@utils/common';
import type { Message } from '@shared/types/DB';
import type { JsonArray } from '@shared/db/prisma/internal/prismaNamespace';
import shared from './shared';

export default async function addingText(ctx: MyContext) {
    let menu;
    if (!shared.validateText(ctx.message?.text?.trim()!)) {
        menu = menuState.addingText(ctx, false, false);
    }
    else {
        const message: Message = {
            caption: ctx.message?.text!.trim()!,
            entities: ctx.message?.entities! as unknown as JsonArray,
            sendout_id: ctx.session.sendout.id!
        };
        
        await db.message.create(message);

        const server = new ServerManager();
        menu = menuState.addingText(ctx, await server.restartProcessOrNot(ctx.session.sendout.name!, true), true);
        common.resetSessionStates(ctx.session);
    }
   
    await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}