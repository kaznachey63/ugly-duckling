import utils from 'src/common/utils';
import type { MyContext } from '@shared/types/SessionData';

/**
 * Обработка команды start
 * @param ctx Контекст
 */
export default async function start(ctx: MyContext) {
    if (!ctx) return;
    try {
        // Удаление сообщений перед данными обработчика
        await utils.common.deleteTwoMessages(ctx, "start");
        await ctx.reply(ctx.t('handlers.commands.start.message'));
    } catch (error) {
        console.error("Ошибка в обработке команды start:", error);
    }
}