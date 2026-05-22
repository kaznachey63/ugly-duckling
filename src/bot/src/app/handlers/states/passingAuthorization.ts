import type { MyContext } from '@shared/types/SessionData';
import menuPassingAuthorization from '@menus/handlers/states/passingAuthorization';
import common from '@utils/common';

export default async function passingAuthorization(ctx: MyContext) {
    try {
        if (ctx.message?.text != "❌ Отменить") {
            try {
                await ctx.deleteMessage();
            } catch {}

            const unknownMessage = await ctx.reply(
                "Действие не опознано, попробуйте снова воспользоваться кнопками: 'Поделиться' и 'Отменить'"
            );

            setTimeout(() => {
                void ctx.api.deleteMessage(ctx.chat!.id, unknownMessage.message_id)
                    .catch(() => {});
            }, 3000);

            return;
        }

        const processingMsg = await ctx.reply(ctx.t("utils.shared.processing"), {
            reply_markup: { remove_keyboard: true }
        });
        const processingMsgId = processingMsg?.message_id;
        await common.deleteMessageProcessing(ctx, processingMsgId);

        const menu = menuPassingAuthorization(ctx);
        common.resetSessionStates(ctx.session);

        await ctx.reply(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        });
    } catch (error) {
        console.error('Ошибка при отменe авторизации:', error);
    }
}