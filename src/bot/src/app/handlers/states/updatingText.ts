import db from '@shared/db';
import type { MyContext } from '@shared/types/SessionData';
import menuUpdatingText from '@menus/handlers/states/updatingText';
import { ServerManager } from "@common/services/ServerManager";
import common from '@utils/common';
import type { Message } from '@shared/types/DataBase';
import type { Prisma } from '@shared/db/generated/client';
import shared from './shared';

export default async function updatingText(ctx: MyContext) {
    let menu;
    if (!shared.validateText(ctx.message?.text?.trim()!)) menu = menuUpdatingText(ctx, false, false);
    else {
        const formatMessage: Message = {
            id: ctx.session.message?.id!,
            caption: ctx.message?.text?.trim()!,
            entities: ctx.message?.entities as unknown as Prisma.JsonArray,
        }

        await db.message.update(formatMessage);

        menu = menuUpdatingText(ctx, await ServerManager.restartProcessOrNot(ctx.session.sendout.name!, true), true);
        common.resetSessionStates(ctx.session);
    }

    await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}