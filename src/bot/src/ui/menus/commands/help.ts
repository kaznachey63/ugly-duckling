import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from 'grammy';

/**
 * Меню команды help
 */
export default function help(ctx: MyContext): Menu<InlineKeyboard> {
    const text = ctx.t('handlers.commands.help.question');
    const keyboard = new InlineKeyboard().url(
        ctx.t('handlers.commands.help.contactAdmin'), 
        "https://t.me/master_cuni"
    );
    return { text, keyboard }
}