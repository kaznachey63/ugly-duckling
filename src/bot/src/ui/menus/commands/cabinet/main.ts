import { InlineKeyboard, Keyboard } from 'grammy';
import type { Cred } from '@shared/types/Cred';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';

/**
 * Меню команды cabinet (авторизованнй пользователь)
 */
function authed(ctx: MyContext, sendouts: Cred[]): Menu<InlineKeyboard> {
    const text = [
        ctx.t('nav.cabinet'),
        ctx.t(commands.cabinet.main.authed.title', { count: sendouts.length })
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

/**
 * Меню команды cabinet (неавторизованнй пользователь)
 */
function notAuthed(ctx: MyContext): Menu<Keyboard> {
    const text = ctx.t(commands.cabinet.main.notAuthed.title')
    const keyboard = new Keyboard().requestContact(
        ctx.t(commands.cabinet.main.notAuthed.button')
    ).resized().oneTime();
    return { text, keyboard }
}

export default {
    authed,
    notAuthed
}