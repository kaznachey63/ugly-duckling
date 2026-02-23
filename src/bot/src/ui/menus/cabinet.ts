import { InlineKeyboard } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import type { Cred } from '@shared/types/Cred';

export function cabinetMenu(ctx: MyContext, sendouts: Cred[]) {
    // Заголовок
    const title = [
        ctx.t('cabinet.title'),
        ctx.t('cabinet.subtitle', { count: sendouts.length })
    ].join('\n');

    // Пустое состояние
    if (!sendouts.length) {
        return { text: ctx.t('cabinet.noSendouts') };
    }

    // Кнопки
    const keyboard = new InlineKeyboard();
    sendouts.forEach((cred) => {
        keyboard.text(
            cred.call,
            `menuDistribution${cred.name}`
        ).row();
    });
    console.log(keyboard.inline_keyboard);
    
    return { text: title, reply_markup: keyboard };
}

export default { cabinetMenu };