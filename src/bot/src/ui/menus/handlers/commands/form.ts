import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from 'grammy';

/**
 * Меню команды form
 */
export default function form(ctx: MyContext): Menu<InlineKeyboard> {
    const text = ctx.t('handlers.commands.form.interest');
    const keyboard = new InlineKeyboard().url(
        ctx.t('handlers.commands.form.form'), 
        "https://forms.gle/i91r3EaCeigbuo479"
    );
    return { text, keyboard }
}