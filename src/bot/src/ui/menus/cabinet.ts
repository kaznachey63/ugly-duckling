import { InlineKeyboard } from 'grammy';
import type { Cred } from '@shared/types/Cred';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';

/**
 * Меню кабинета
 */
export default function cabinet(ctx: MyContext, sendouts: Cred[]): Menu<InlineKeyboard> {
    const text = [
        ctx.t('nav.cabinet'),
        ctx.t('cabinet.subtitle', { count: sendouts.length })
    ].join('\n');

    const keyboard = new InlineKeyboard();
    sendouts.forEach((cred) => {
        keyboard.text(
            cred.call,
            `mainDistribution${cred.name}`
        ).row();
    });    
    return { text, keyboard };
}