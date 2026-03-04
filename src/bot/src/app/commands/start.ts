import type { MyContext } from '@shared/types/SessionData';
import init from '@utils/initialize';

/**
 * Обработка команды start
 */
export default async function start(ctx: MyContext) {
    try {
        await ctx.reply(ctx.t("commands.start.message"));
    } catch (error) {
        console.error("Ошибка в обработке команды start:", error);
    }
}