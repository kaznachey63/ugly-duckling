import type { MyContext } from '@shared/types/SessionData';
import menuPassingAuthorization from '@menus/handlers/states/passingAuthorization';
import common from '@utils/common';

export default async function passingAuthorization(ctx: MyContext) {

    if (!ctx.session.state.passingAuthorization) return;

    // ❌ НЕ отмена и НЕ контакт
    if (ctx.message?.text !== "❌ Отменить" && !ctx.message?.contact) {

        // сюда диспетчер уже НЕ нужен
        await ctx.reply(
            "❌ Некорректный ввод. Используйте кнопки: 'Поделиться' или 'Отменить'"
        );

        return;
    }

    // ❌ отмена
    if (ctx.message?.text === "❌ Отменить") {
    ctx.session.state.lock = true;

        const processing = await ctx.reply(
            "Обработка...",
            { reply_markup: { remove_keyboard: true } }
        );

        await common.deleteMessageProcessing(
            ctx,
            processing.message_id
        );

        ctx.session.state.passingAuthorization = false;
    ctx.session.state.lock = false;

        return;
    }
}