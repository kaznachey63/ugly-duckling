import type { MyContext, SessionData } from '@shared/types/SessionData';
import utils from 'src/common/utils';

/**
 * Обработка команды about
 * @param ctx Контекст
 */
export default async function about(ctx: MyContext) {
    if (!ctx) return;
    try {
        // Удаление сообщений перед данными обработчика
        await utils.common.deleteTwoMessages(ctx, "about")

        await ctx.reply(
            "Сервис разработан для автоматизации рекламы \\(постов, рассылок\\) своих продуктов \\(предложений\\) внутри групп / чатов / каналов\n\n" +
            "Инструкция по использованию Бота \\- по кнопке ниже\\!\n",
            {
                parse_mode: 'MarkdownV2',
                ...Markup.inlineKeyboard([
                    Markup.button.url("Инструкция", "https://telegra.ph/Komandy-Rassylka-bot-11-29-2")
                ])
            }
        );
    } catch (error) {
        console.error("Ошибка в обработке команды about: ", error);
    }
}