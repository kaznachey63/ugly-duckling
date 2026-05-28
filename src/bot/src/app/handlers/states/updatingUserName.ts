import db from '@shared/db';
import type { MyContext } from '@shared/types/SessionData';
import menuUpdatingUserName from '@menus/handlers/states/updatingUserName';
import common from '@utils/common';
import shared from './shared';

export default async function updatingUserName(ctx: MyContext) {
    let menu;
    const name = ctx.message?.text!;
    if (!shared.validateText(name)) menu = menuUpdatingUserName(ctx, false);
    else {
        const result = await db.user.updateName(ctx.session.userForUpdate.id!, name);

        menu = menuUpdatingUserName(ctx, true, result);
        common.resetSessionStates(ctx.session);
    }

    await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}