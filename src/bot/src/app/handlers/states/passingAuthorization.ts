import type { MyContext } from '@shared/types/SessionData';
import menuPassingAuthorization from '@menus/handlers/states/passingAuthorization';
import common from '@utils/common';

export default async function passingAuthorization(ctx: MyContext) {
    try {
        // пользователь написал хуйню
        if (ctx.message?.text != "❌ Отменить") {

            // удаляем его сообщение
            try {
                await ctx.deleteMessage();
            } catch {}

            // отправляем предупреждение
            const unknownMessage = await ctx.reply(
                "Действие не опознано, попробуйте снова воспользоваться кнопками: 'Поделиться' и 'Отменить'"
            );

            // сохраняем id временного сообщения
            ctx.session.other.ids.lastTempMessageId = unknownMessage.message_id;

            return;
        }

        // скрываем клавиатуру
        const processingMsg = await ctx.reply(
            ctx.t("utils.shared.processing"),
            {
                reply_markup: { remove_keyboard: true }
            }
        );

        // удаляем всё
        await common.deleteMessageProcessing(
            ctx,
            processingMsg.message_id
        );

        // сбрасываем временный id
        ctx.session.other.ids.lastTempMessageId = 0;

        // сбрасываем state
        common.resetSessionStates(ctx.session);

        const menu = menuPassingAuthorization(ctx);

        await ctx.reply(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        });

    } catch (error) {
        console.error('Ошибка при отменe авторизации:', error);
    }
}