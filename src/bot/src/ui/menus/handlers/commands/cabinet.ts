import type { MyContext } from '@shared/types/SessionData';
import { Keyboard } from 'grammy';
import type { Menu } from '@shared/types/Menu';

/**
 * Меню команды cabinet
 */
export default function about(ctx: MyContext): Menu<Keyboard> {
    const text = ctx.t('handlers.commands.cabinet.message')
    const keyboard = new Keyboard().requestContact(
        ctx.t('handlers.commands.cabinet.button')
    ).resized().oneTime();
    return { text, keyboard }
}