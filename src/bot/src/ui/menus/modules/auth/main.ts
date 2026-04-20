import { Keyboard } from 'grammy';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';

/**
 * Меню команды auth
 */
export default function main(ctx: MyContext, userExistsInDB: boolean): Menu<Keyboard> {
    let text: string[] = [];
    const keyboard = new Keyboard();

    if (userExistsInDB) {
        text.push(ctx.t("commands.auth.userExistsInSystem"));
    }
    else {
        text.push(ctx.t("commands.auth.title"));
        keyboard.requestContact(
            ctx.t("commands.auth.button")
        ).resized().oneTime();
    }
    return { text: format.escapeMarkdown(text.join('\n')), keyboard }
}