import db from '@shared/db';
import type { MyContext } from '@shared/types/SessionData';
import menuUpdatingUserPhone from '@menus/handlers/states/updatingUserPhone';
import common from '@utils/common';
import shared from './shared';
import { CryptoService } from '@common/services/CryptoService';

export default async function updatingUserPhone(ctx: MyContext) {
    let menu;
    const phone = ctx.message?.text!;
    if (!shared.validatePhone(phone)) menu = menuUpdatingUserPhone(ctx, false);
    else {
        const phoneHashed = CryptoService.encrypt(phone!)
        const result = await db.user.updatePhone(ctx.session.userForUpdate.id!, phoneHashed);

        menu = menuUpdatingUserPhone(ctx, true, result);
        common.resetSessionStates(ctx.session);
    }

    await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}