import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import utils from '@utils';
import type { Status } from "@shared/types/server/Status";

/**
 * Меню раздела Состояние
 */
export default function condition(ctx: MyContext, status: Status): Menu<InlineKeyboard> {
    const sendoutName = ctx.session.sendout.name!;
    let keyboard = new InlineKeyboard();
    
    switch (status) {
        case "active": {
            keyboard
            .text(
                ctx.t("modules.shared.sendout.view.sendout.condition.buttons.stop"),
                `stopSendout:${sendoutName}`
            )
            .text(
                ctx.t("modules.shared.sendout.view.sendout.condition.buttons.restart"),
                `restartSendout:${sendoutName}`
            );
            break;
        }
        case "inactive": {
            keyboard.text(
                ctx.t("modules.shared.sendout.view.sendout.condition.buttons.start"),
                `startSendout:${sendoutName}`
            );
            break;
        }
    }
    
    const text = [
        ctx.t(`modulesshared.sendout.view.sendout.condition.status.${status}`),
        ctx.t("modules.shared.sendout.view.sendout.condition.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") }),
    ].join('\n\n');

    keyboard.row().text(ctx.t("utils.shared.buttons.back"), `viewSendout:${ctx.session.sendout.name}`);
    
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}