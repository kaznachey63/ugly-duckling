import { InlineKeyboard } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import type { Menu } from '@shared/types/Menu';
import format from '@utils/formatting';

/**
 * Отображение конрктеной рассылки
 */
export default function view(ctx: MyContext): Menu<InlineKeyboard> {
    const sendoutId = ctx.session.sendout.id;
    const text = [
        ctx.t("modules.shared.sendout.view.main.title", { call: ctx.session.sendout.call }),
        ctx.t("modules.shared.sendout.view.main.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.shared.sendout.view.main.buttons.message"), `mainMessage:${sendoutId}`).row()
        .text(ctx.t("modules.shared.sendout.view.main.buttons.schedule"), `mainSchedule:${sendoutId}`).row()
        .text(ctx.t("modules.shared.sendout.view.main.buttons.statistic"), `mainStatistic:${sendoutId}`).row()
    ;
    
    if (ctx.session.isAdmin) {
        keyboard.text(ctx.t("modules.shared.sendout.view.main.buttons.owner"), `mainOwner:${sendoutId}`).row()
        keyboard.text(ctx.t("modules.shared.sendout.view.main.buttons.call"), `mainSendoutCall:${sendoutId}`).row()
    }
    
    keyboard.text(ctx.t("utils.shared.buttons.back"), "mainSendout");
    return { text: format.escapeMarkdown(text), keyboard };
}