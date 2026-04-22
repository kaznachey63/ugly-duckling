import { InlineKeyboard, Keyboard } from 'grammy';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';

/**
 * Меню кнопки войти
 */
function login(ctx: MyContext): Menu<Keyboard> {
    const text = [ 
        ctx.t("commands.cabinet.profile.auth.login.title"),
        ctx.t("commands.cabinet.profile.auth.login.path")
    ].join('\n\n');
    
    const keyboard = new Keyboard()
        .requestContact(
            ctx.t("commands.cabinet.profile.auth.login.button")
        ).resized().oneTime()
    ;
    
    return { text: format.escapeMarkdown(text), keyboard }
}

/**
 * Меню кнопки выйти
 */
function logout(ctx: MyContext, result: boolean): Menu<InlineKeyboard> {
    const text = [ 
        result ? 
            ctx.t("commands.cabinet.profile.auth.logout.good") :
            ctx.t("commands.cabinet.profile.auth.logout.bad")
        ,
        ctx.t("commands.cabinet.profile.auth.logout.path")
    ].join('\n\n');
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), "mainProfile");
    // .row().text(ctx.t('utils.shared.back'), `mainContract:${ctx.session.distribution.name}`)

    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    login,
    logout
}