import db from '@shared/db';
import type { MyContext } from '@shared/types/SessionData';
import menuUpdatingSendoutCall from '@menus/handlers/states/updatingSendoutCall';
import common from '@utils/common';
import shared from './shared';

export default async function updatingText(ctx: MyContext) {
    let menu;
    const text = ctx.message?.text?.trim()!;
    if (!shared.validateText(text)) menu = menuUpdatingSendoutCall(ctx, false, false);
    else {
        const result = await db.sendout.updateCall(ctx.session.sendout.id!, text);
        menu = menuUpdatingSendoutCall(ctx, result, true);
        common.resetSessionStates(ctx.session);
    }

    await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}