import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from 'grammy';
import format from '@utils/formatting';

/**
 * Меню команды help
 */
export default function help(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t('commands.settings.help.title'),
        ctx.t('commands.settings.help.path')
    ].join('\n\n');
    const keyboard = new InlineKeyboard()
        .url(ctx.t("commands.settings.help.contactAdmin"), "https://t.me/master_cuni").row()
        .text(ctx.t("utils.shared.back"), "mainSettings")
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}