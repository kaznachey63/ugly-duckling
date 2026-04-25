import { InlineKeyboard, Keyboard } from 'grammy';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';

/**
 * Меню команды cabinet
 */
export default function main(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("utils.shared.cabinet")
    ].join('\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.commands.cabinet.main.buttons.sendout"), "mainSendouts")
        .text(ctx.t("modules.commands.cabinet.main.buttons.profile"), "mainProfile")
    ;
    return { text: format.escapeMarkdown(text), keyboard };
}

/**
 * Меню профиль
 */
function main2(ctx: MyContext, userExistsInDB: boolean, userIsAdmin: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.cabinet.profile.title"),
        ctx.t("modules.commands.cabinet.profile.path")
    ].join('\n\n');

    const keyboard = new InlineKeyboard();
    
    if (!userIsAdmin || !userExistsInDB) keyboard.text(ctx.t("modules.commands.cabinet.profile.buttons.contract"), "mainContract").row();

    if (userExistsInDB) keyboard.text(ctx.t("modules.commands.cabinet.profile.buttons.logout"), "logoutAuth").row()
    else keyboard.text(ctx.t("modules.commands.cabinet.profile.buttons.login"), "loginAuth").row()

    keyboard.text(ctx.t("utils.shared.buttons.back"), "mainCabinet")
    return { text: format.escapeMarkdown(text), keyboard };
}