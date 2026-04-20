import { InlineKeyboard, Keyboard } from 'grammy';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';

/**
 * Меню команды cabinet
 */
export default function main(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t('utils.shared.cabinet')
    ].join('\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("commands.cabinet.main.buttons.sendout"), "mainSendouts")
        .text(ctx.t("commands.cabinet.main.buttons.profile"), "mainProfile")
    ;
    return { text: format.escapeMarkdown(text), keyboard };
}
