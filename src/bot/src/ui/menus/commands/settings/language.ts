import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import utils from '@utils';
import { InlineKeyboard } from 'grammy';

/**
 * Меню смены языка
 */
export default function language(ctx: MyContext): Menu<InlineKeyboard> {
    const text = ctx.t("handlers.commands.settings.main.title");
    const keyboard = new InlineKeyboard();
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}