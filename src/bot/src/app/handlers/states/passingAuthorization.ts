import type { MyContext } from '@shared/types/SessionData';
import menuPassingAuthorization from '@menus/handlers/states/passingAuthorization';
import common from '@utils/common';

export default async function passingAuthorization(ctx: MyContext) {
    try {
        if (ctx.message?.text != "❌ Отменить") {
            const unknownMessage = await ctx.reply("Действие не опознано, попробуйте снова воспользоваться кнопками: 'Поделиться' и 'Отменить'");
            ctx.session.other.ids.cash.push(unknownMessage.message_id);
            return;
        }

        const processingMsg = await ctx.reply(ctx.t("utils.shared.processing"), {
            reply_markup: { remove_keyboard: true }
        });
        ctx.session.other.ids.cash.push(processingMsg.message_id);
        await common.deleteCashMessages(ctx);

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