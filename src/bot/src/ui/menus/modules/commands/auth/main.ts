import { InlineKeyboard, Keyboard } from 'grammy';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import constants from '@common/constants';

/**
 * Отправка кнопки войти
 */
function login(ctx: MyContext): Menu<Keyboard> {
    const attempts = ctx.session.authLimit.failed_attempts!;
    const text = [ 
        attempts > 0 ? ctx.t("modules.commands.cabinet.auth.login.manyAttempts", { actualAttempts: attempts, maxAttempts: constants.limit.authMaxAttempts }) : '',
        ctx.t("modules.commands.cabinet.auth.login.title"),
    ].filter(Boolean).join('\n\n');
    
    const keyboard = new Keyboard()
        .requestContact(ctx.t("modules.commands.cabinet.auth.login.buttons.phone"))
        .text(ctx.t("modules.commands.cabinet.auth.login.buttons.cancel"))
        .resized().oneTime()
    ;
    
    return { text: format.escapeMarkdown(text), keyboard }
}

/**
 * Запрет к авторизации
 */
function stop(ctx: MyContext): Menu<InlineKeyboard> {
    const text = ctx.t("modules.commands.cabinet.auth.login.stop", { dateTime: ctx.session.authLimit.blocked_until?.toLocaleString('ru-RU') });
    const keyboard = new InlineKeyboard();
    
    return { text: format.escapeMarkdown(text), keyboard }
}

/**
 * Обработка кнопки войти
 */
function processLogin(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = 
        result ?
            ctx.t("modules.commands.cabinet.auth.login.good") :
            ctx.t("modules.commands.cabinet.auth.login.bad")
    ;

    const keyboard = new InlineKeyboard();
    
    if (ctx.session.isAdmin) keyboard.text(ctx.t("utils.shared.panel"), "mainPanel");
    else keyboard.text(ctx.t("utils.shared.cabinet"), "mainCabinet");

    return { text: format.escapeMarkdown(text), keyboard }
}

/**
 * Меню кнопки выйти
 */
function logout(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = 
        result ? 
            ctx.t("modules.commands.cabinet.auth.logout.good") :
            ctx.t("modules.commands.cabinet.auth.logout.bad")
    const keyboard = new InlineKeyboard();

    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    processLogin,
    login,
    logout,
    stop
}