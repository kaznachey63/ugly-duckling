import type { MyContext } from '@shared/types/SessionData';
import menuPassingAuthorization from '@menus/handlers/states/passingAuthorization';
import common from '@utils/common';

export default async function passingAuthorization(ctx: MyContext) {
    try {

        // не отмена
        if (ctx.message?.text !== "❌ Отменить") {

            try {
                await ctx.api.deleteMessage(
                    ctx.chat!.id,
                    ctx.message!.message_id
                );
            } catch {}

            await ctx.reply(
                "Действие не опознано, попробуйте снова воспользоваться кнопками: 'Поделиться' и 'Отменить'"
            );

            return;
        }

        // сообщение обработки
        const processingMsg = await ctx.reply(
            ctx.t("utils.shared.processing"),
            {
                reply_markup: {
                    remove_keyboard: true
                }
            }
        );

        // удаляем ВСЁ
        await common.deleteMessageProcessing(
            ctx,
            processingMsg.message_id
        );

        // сброс state
        common.resetSessionStates(ctx.session);

        // новое меню
        const menu = menuPassingAuthorization(ctx);

        await ctx.reply(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        });

    } catch (error) {
        console.error(
            'Ошибка при отменe авторизации:',
            error
        );
    }
}