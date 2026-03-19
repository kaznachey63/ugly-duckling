import constants from '@constants';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';

/**
 * Меню команды form
 */
export default function form(ctx: MyContext): Menu<InlineKeyboard> {
    const text = ctx.t("commands.form.interest");
    const keyboard = new InlineKeyboard().url(
        ctx.t('commands.form.form'), 
        constants.link.form
    );
    return { text: format.escapeMarkdown(text), keyboard }
}