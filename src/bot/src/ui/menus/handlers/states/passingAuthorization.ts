import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import format from '@utils/formatting';

/**
 * Результат прохождения авторизации
 */
export default function passingAuthorization(ctx: MyContext) {
    const text = [
        ctx.t("modules.commands.cabinet.auth.login.canceled"),
        ctx.t("modules.commands.cabinet.auth.login.path")
    ].join('\n\n');

    const keyboard = new InlineKeyboard();
    return { text: format.escapeMarkdown(text), keyboard }
};