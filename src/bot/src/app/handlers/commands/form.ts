import type { MyContext, SessionData } from '@shared/types/SessionData';
import utils from 'src/common/utils';

/**
 * Обработка команды form
 * @param ctx Контекст
 */
export default async function form(ctx: MyContext) {
    if (!ctx) return;
    try {
        // Удаление сообщений перед данными обработчика
        await utils.common.deleteTwoMessages(ctx, "form")

        await ctx.reply("Заинтересованы в продукте?\nЗаполните анкету ниже и мы с вами свяжемся\\!",
            {
                parse_mode: 'MarkdownV2',
                ...Markup.inlineKeyboard([
                    Markup.button.url("Анкета", "https://forms.gle/i91r3EaCeigbuo479"),
                ])
            }
        );
    } catch (error) {
        console.error("Ошибка в обработке команды form: ", error);
    }
}