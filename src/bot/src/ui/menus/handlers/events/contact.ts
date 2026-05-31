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
    const keyboard = new InlineKeyboard();

    if (ctx.session.authLimit.failed_attempts == 3) text.splice(1, 0, ctx.t("modules.commands.cabinet.auth.login.stop", { dateTime: ctx.session.authLimit.blocked_until?.toLocaleString('ru-RU') }));
    else if (ctx.session.authLimit.failed_attempts! > 0) {
        text.splice(1, 0, ctx.t("modules.commands.cabinet.auth.login.manyAttempts", { actualAttempts: ctx.session.authLimit.failed_attempts, maxAttempts: constants.limit.authMaxAttempts }));
        keyboard.text(ctx.t("modules.commands.cabinet.auth.login.buttons.again"), "loginAuth");
    }
    

    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
}