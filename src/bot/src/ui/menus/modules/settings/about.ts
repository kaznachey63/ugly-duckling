import constants from '@constants';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

/**
 * Меню команды about
 */
export default function about(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t('commands.settings.about.title'),
        ctx.t('commands.settings.about.path')
    ].join('\n\n');
    const keyboard = new InlineKeyboard()
        .url(ctx.t("commands.settings.about.instruction"), constants.link.instructionAboutCommands).row()
        .text(ctx.t("utils.shared.buttons.back"), "mainSettings")
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}