import { InlineKeyboard } from 'grammy';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';

/**
 * Меню профиль
 */
export default function main(ctx: MyContext, userExistsInDB: boolean, userIsAdmin: boolean): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.profile.title"),
        ctx.t("commands.cabinet.profile.path")
    ].join('\n\n');

    const keyboard = new InlineKeyboard();
    
    if (!userIsAdmin || !userExistsInDB) keyboard.text(ctx.t("commands.cabinet.profile.buttons.contract"), "mainContract").row();

    if (userExistsInDB) keyboard.text(ctx.t("commands.cabinet.profile.buttons.logout"), "logoutAuth").row()
    else keyboard.text(ctx.t("commands.cabinet.profile.buttons.login"), "loginAuth").row()

    keyboard.text(ctx.t("utils.shared.back"), "mainCabinet")
    return { text: format.escapeMarkdown(text), keyboard };
}