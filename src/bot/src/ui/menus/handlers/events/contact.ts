import { InlineKeyboard, Keyboard } from 'grammy';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import constants from '@common/constants';

/**
 * Меню обработки контакта
 */
export default function contact(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [ 
        ctx.t("handlers.events.contact.accessDenied"),
        ctx.t("modules.commands.cabinet.auth.login.path")
    ];

    if (ctx.session.authLimit.failed_attempts! > 0 && ctx.session.authLimit.failed_attempts! < 4) text.splice(1, 0, ctx.t("modules.commands.cabinet.auth.login.manyAttempts", { actualAttempts: ctx.session.authLimit.failed_attempts, maxAttempts: constants.auth.maxAttempts }));
    else if (ctx.session.authLimit.failed_attempts == 3) text.splice(1, 0, ctx.t("modules.commands.cabinet.auth.login.stop", { dateTime: ctx.session.authLimit.blocked_until }));
    
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), "mainCabinet");

    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
}