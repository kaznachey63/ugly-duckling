import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import utils from '@utils';
import type { Status } from "@shared/types/server/Status";

/**
 * Меню раздела Состояние
 */
export default function condition(ctx: MyContext, status: Status): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.sendout.name!;
    let keyboard = new InlineKeyboard();
    
    switch (status) {
        case "active": {
            keyboard
            .text(
                ctx.t("commands.cabinet.distribution.condition.buttons.stop"),
                `stopDistribution:${nameDistribution}`
            )
            .text(
                ctx.t("commands.cabinet.distribution.condition.buttons.restart"),
                `restartDistribution:${nameDistribution}`
            );
            break;
        }
        case "inactive": {
            keyboard.text(
                ctx.t("commands.cabinet.distribution.condition.buttons.start"),
                `startDistribution:${nameDistribution}`
            );
            break;
        }
    }
    keyboard.row();
    
    const text = [
        ctx.t(`commands.cabinet.distribution.condition.status.${status}`),
        ctx.t("commands.cabinet.distribution.condition.path", { call: ctx.session.sendout.call }),
    ].join('\n\n');

    keyboard.text(ctx.t('utils.shared.back'), `mainDistribution:${ctx.session.sendout.name}`);
    
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}