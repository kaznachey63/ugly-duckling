import { InlineKeyboard, Keyboard } from 'grammy';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import constants from '@common/constants';

/**
 * Отправка кнопки войти
 */
function login(ctx: MyContext, attempts?: number): Menu<Keyboard> {
    const text = [ 
        attempts ? ctx.t("modules.commands.cabinet.auth.login.manyAttempts", { actualAttempts: attempts, maxAttempts: constants.auth.maxAttempts }) : '',
        ctx.t("modules.commands.cabinet.auth.login.title"),
        ctx.t("modules.commands.cabinet.auth.login.path")
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
    const text = [ 
        ctx.t("modules.commands.cabinet.auth.login.stop", { dateTime: ctx.session.authLimit.blocked_until }),
        ctx.t("modules.commands.cabinet.auth.login.path")
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), "mainCabinet");
    
    return { text: format.escapeMarkdown(text), keyboard }
}

/**
 * Обработка кнопки войти
 */
function processLogin(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    let text = [];

    if (result) {
        text.push(
            ctx.t("modules.commands.cabinet.auth.login.good"),
            ctx.t("modules.commands.cabinet.auth.login.path")
        );
    }
    else {
        text.push(
            ctx.t("modules.commands.cabinet.auth.login.bad"),
            ctx.t("modules.commands.cabinet.auth.login.path")
        );
    }
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), "mainCabinet");

    return { text: format.escapeMarkdown(text.join('\n\n')), keyboard }
}

/**
 * Меню кнопки выйти
 */
function logout(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [ 
        result ? 
            ctx.t("modules.commands.cabinet.auth.logout.good") :
            ctx.t("modules.commands.cabinet.auth.logout.bad")
        ,
        ctx.t("modules.commands.cabinet.auth.logout.path")
    ].join('\n\n');
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), "mainCabinet");

    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    processLogin,
    login,
    logout,
    stop
}