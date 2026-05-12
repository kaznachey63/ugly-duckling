import type { MyContext } from '@shared/types/SessionData';
import menuPassingAuthorization from '@menus/handlers/states/passingAuthorization';
import common from '@utils/common';

export default async function passingAuthorization(ctx: MyContext) {
    try {
        const processingMsg = await ctx.reply(ctx.t("utils.shared.processing"), {
            reply_markup: { remove_keyboard: true }
        });
        const processingMsgId = processingMsg?.message_id;
        await common.deleteMessageProcessing(ctx, processingMsgId);

        if (ctx.message?.text === "❌ Отменить") {
            const menu = menuPassingAuthorization(ctx);
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