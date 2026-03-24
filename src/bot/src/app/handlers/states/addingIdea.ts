import type { MyContext } from '@shared/types/SessionData';
import menuState from '@menus/handlers/states';
import common from '@utils/common';

export default async function addingIdea(ctx: MyContext) {
    let forwardResult = false;

    try {
        const result = await ctx.forwardMessage("-1003760118458");
        forwardResult = !!result;
    } catch (error) {
        console.error('Не удалось добавить идею:', error);
    }

    const menu = menuState.addingIdea(ctx, forwardResult);
    common.resetSessionStates(ctx.session);

    await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}