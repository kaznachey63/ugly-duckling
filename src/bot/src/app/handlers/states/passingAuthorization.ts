import type { MyContext } from '@shared/types/SessionData';
import menuState from '@menus/handlers/states';
import common from '@utils/common';

export default async function passingAuthorization(ctx: MyContext) {
    try {
        if (ctx.message?.text === "❌ Отменить") {
            const menu = menuState.passingAuthorization(ctx);
            common.resetSessionStates(ctx.session);

            await ctx.reply(menu.text, {
                reply_markup: menu.keyboard,
                parse_mode: "MarkdownV2"
            });
        }
    } catch (error) {
        console.error('Ошибка при отменен авторизации:', error);
    }
}