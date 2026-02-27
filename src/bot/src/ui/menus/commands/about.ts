import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from 'grammy';

/**
 * Меню команды about
 */
export default function about(ctx: MyContext): Menu<InlineKeyboard> {
    const text = ctx.t('handlers.commands.about.description');
    const keyboard = new InlineKeyboard().url(
        ctx.t(commands.about.instruction'), 
        "https://telegra.ph/Komandy-Rassylka-bot-11-29-2"
    );
    return { text, keyboard }
}