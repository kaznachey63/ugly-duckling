import { InlineKeyboard, Keyboard } from 'grammy';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';

/**
 * Меню обработки контакта
 */
export default function contact(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [ 
        ctx.t('handlers.events.contact.accessDenied'),
        ctx.t("commands.cabinet.profile.auth.login.path")
    ].join('\n\n');
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), "mainProfile");

    return { text: format.escapeMarkdown(text), keyboard }
}