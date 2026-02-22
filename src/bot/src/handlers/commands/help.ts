import type { MyContext, SessionData } from '@shared/types/SessionData';
import utils from '@utils';

/**
 * Обработка команды help
 * @param ctx Контекст
 */
export default async function help(ctx: MyContext) {
    if (!ctx) return;
    try {
        // Удаление сообщений перед данными обработчика
        await utils.common.deleteTwoMessages(ctx, "help");

        await ctx.reply("Столкнулись с проблемой?\nПоявились вопросы?\nЖелаете похвалить работу сервиса?\nЕсть мысли по улучшению сервиса?",
            {
                parse_mode: 'MarkdownV2',
                ...Markup.inlineKeyboard([
                    Markup.button.url("Обратиться к администратору", "https://t.me/master_cuni"),
                ])
            }
        );
    } catch (error) {
        console.error("Ошибка в обработке команды help:", error);
    }
}