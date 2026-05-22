import type { MyContext } from '@shared/types/SessionData';
import menuPassingAuthorization from '@menus/handlers/states/passingAuthorization';
import common from '@utils/common';

export default async function passingAuthorization(ctx: MyContext) {
    try {

        // если не нажал отмену
        if (ctx.message?.text !== "❌ Отменить") {

            // логируем входящее сообщение
            console.log(
                "[AUTH INPUT]",
                ctx.message?.message_id,
                ctx.message?.text
            );

            // пробуем удалить сообщение пользователя
            try {

                console.log(
                    "[DELETE TRY]",
                    ctx.message!.message_id
                );

                await ctx.api.deleteMessage(
                    ctx.chat!.id,
                    ctx.message!.message_id
                );

                console.log(
                    "[DELETE SUCCESS]",
                    ctx.message!.message_id
                );

            } catch (error) {

                console.log(
                    "[DELETE ERROR]",
                    error
                );
            }

            // отвечаем ВСЕГДА
            const warnMsg = await ctx.reply(
                "Действие не опознано, попробуйте снова воспользоваться кнопками: 'Поделиться' и 'Отменить'"
            );

            console.log(
                "[WARN MESSAGE]",
                warnMsg.message_id
            );

            return;
        }

        // processing
        const processingMsg = await ctx.reply(
            ctx.t("utils.shared.processing"),
            {
                reply_markup: {
                    remove_keyboard: true
                }
            }
        );

        console.log(
            "[PROCESSING]",
            processingMsg.message_id
        );

        // удаляем всё
        await common.deleteMessageProcessing(
            ctx,
            processingMsg.message_id
        );

        // сбрасываем состояния
        common.resetSessionStates(ctx.session);

        // меню
        const menu = menuPassingAuthorization(ctx);

        await ctx.reply(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        });

    } catch (error) {

        console.error(
            "[PASSING AUTH ERROR]",
            error
        );
    }
}