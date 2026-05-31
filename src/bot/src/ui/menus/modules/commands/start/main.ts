import constants from '@common/constants';
import type { Menu } from '@shared/types/Menu';
import type { MyContext } from '@shared/types/SessionData';
import utils from '@utils';
import { InlineKeyboard } from 'grammy';

/**
 * Меню команды start
 */
export default function main(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.start.title"),
        ctx.t("modules.commands.start.commands"),
        ctx.t("modules.commands.start.uAdmin"),
        ctx.t("modules.commands.start.link"),
    ].join('\n\n');

    const keyboard = new InlineKeyboard().url(ctx.t("modules.commands.settings.about.instruction"), constants.link.instruction.commands);

    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}