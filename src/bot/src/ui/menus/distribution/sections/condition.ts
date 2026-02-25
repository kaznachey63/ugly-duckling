import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import utils from '@utils';
import type { Status } from "@shared/types/server/Status";

/**
 * Меню раздела Состояние
 */
export default function condition(ctx: MyContext, status: Status): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.distribution.name!;
    let keyboard = new InlineKeyboard();

    switch (status) {
        case "active": {
            keyboard.text(
                ctx.t("distribution.sections.condition.buttons.stop"),
                `stopProcess${nameDistribution}`
            );
        }
        case "inactive": {
            keyboard.text(
                ctx.t("distribution.sections.condition.buttons.start"),
                `stopProcess${nameDistribution}`
            );
        }
    }

    const text = [
        ctx.t(`distribution.sections.condition.status.${status}`),
        ctx.t("distribution.sections.condition.path"),
    ].join('\n\n');

    keyboard.text(ctx.t('nav.back'), 'mainDistribution');

    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}