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
    console.log(status);
    
    switch (status) {
        case "active": {
            keyboard.text(
                ctx.t("distribution.sections.condition.buttons.stop"),
                `stopDistribution${nameDistribution}`
            );
            break;
        }
        case "inactive": {
            keyboard.text(
                ctx.t("distribution.sections.condition.buttons.start"),
                `startDistribution${nameDistribution}`
            );
            break;
        }
    }
    keyboard.row();

    const text = [
        ctx.t(`distribution.sections.condition.status.${status}`),
        ctx.t("distribution.sections.condition.path", { call: ctx.session.distribution.call }),
    ].join('\n\n');

    keyboard.text(ctx.t('nav.back'), `mainDistribution${ctx.session.distribution.name}`);
    console.log(keyboard);
    
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}