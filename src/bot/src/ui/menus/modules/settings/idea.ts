import constants from '@constants';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import format from '@utils/formatting';
import { InlineKeyboard } from 'grammy';
import common from '@utils/common';

/**
 * Меню команды idea
 */
function main(ctx: MyContext, lastMessageId: string): Menu<InlineKeyboard> {
    const text = [
        ctx.t('commands.settings.idea.main.title'),
        ctx.t('commands.settings.idea.main.path')
    ].join('\n\n');
    const keyboard = new InlineKeyboard().text(ctx.t("commands.settings.idea.main.buttons.add"), "addIdea").style("success");

    if (common.isAdmin(ctx)) {
        keyboard.url(ctx.t("commands.settings.idea.main.buttons.see"), constants.link.chatIdeas + lastMessageId);
    }

    keyboard.row().text(ctx.t("utils.shared.buttons.back"), "mainSettings");
    return { text: format.escapeMarkdown(text), keyboard }
}

function add(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t('commands.settings.idea.add.title'),
        ctx.t('commands.settings.idea.add.path')
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), "mainIdea");
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    main, 
    add
}