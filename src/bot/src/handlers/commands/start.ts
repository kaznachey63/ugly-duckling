import utils from '@utils';
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

        await ctx.reply(
            "Приветствую! Я - Телеграмм-бот, помощник для рассылки.\n\n" +
            "Настоятельно рекомендую ознакомиться со всем реестром моих команд по нажатию овальной кнопки 'Меню' в левом нижнем углу экрана.\n" +
            "Предварительно прочитав руководство по использованию, вызываемое командой '/about'"
        );
    } catch (error) {
        console.error("Ошибка в обработке команды start:", error);
    }
}