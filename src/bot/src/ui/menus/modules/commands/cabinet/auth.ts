import { InlineKeyboard, Keyboard } from 'grammy';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';

/**
 * Отправка кнопки войти
 */
function sendLogin(ctx: MyContext): Menu<Keyboard> {
    const text = [ 
        ctx.t("modules.commands.cabinet.auth.login.title"),
        ctx.t("modules.commands.cabinet.auth.login.path")
    ].join('\n\n');
    
    const keyboard = new Keyboard()
        .requestContact(ctx.t("modules.commands.cabinet.auth.login.button"))
        .text(ctx.t("modules.commands.cabinet.auth.login.cancel"))
        .resized().oneTime()
    ;
    
    return { text: format.escapeMarkdown(text), keyboard }
}

/**
 * Обработка кнопки войти
 */
function processLogin(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [ 
        result ? 
            ctx.t("modules.commands.cabinet.auth.login.good") :
            ctx.t("modules.commands.cabinet.auth.login.bad")
        ,
        ctx.t("modules.commands.cabinet.auth.login.path")
    ].join('\n\n');
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), "mainCabinet");

    return { text: format.escapeMarkdown(text), keyboard }
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
    sendLogin,
    logout
}