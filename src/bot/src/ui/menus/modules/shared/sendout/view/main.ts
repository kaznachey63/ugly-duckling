import { InlineKeyboard } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import type { Menu } from '@shared/types/Menu';
import format from '@utils/formatting';
import type { Sendout } from '@shared/types/Sendout';
import constants from '@constants';

/**
 * Отображение рассылок
 */
function viewSendouts(ctx: MyContext, sendouts: Sendout[]): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.shared.sendout.view.main.title"),
        ctx.t("modules.shared.sendout.view.main.path", { menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") }),
    ].join('\n\n');

    const keyboard = new InlineKeyboard();

    sendouts.forEach((cred) => {
        keyboard.text(
            cred.call ?? cred.label,
            `viewSendout:${cred.name}`
        ).row();
    });    
    keyboard.row().text(ctx.t("utils.shared.buttons.back"), ctx.session.isAdmin ? "mainPanel" : "mainCabinet");

    return { text: format.escapeMarkdown(text), keyboard };
}

/**
 * Отображение конрктеной рассылки
 */
function viewSendout(ctx: MyContext): Menu<InlineKeyboard> {
    const sendoutName = ctx.session.sendout.name;
    const text = [
        ctx.t("modules.shared.sendout.view.sendout.main.sendout.title", { call: ctx.session.sendout.call }),
        ctx.t("modules.shared.sendout.view.sendout.main.sendout.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.shared.sendout.view.sendout.main.sendout.buttons.message"), `mainMessage:${sendoutName}`).row()
        .text(ctx.t("modules.shared.sendout.view.sendout.main.sendout.buttons.schedule"), `mainSchedule:${sendoutName}`).row()
        .text(ctx.t("modules.shared.sendout.view.sendout.main.sendout.buttons.statistic"), `mainStatistic:${sendoutName}`).row()
    ;
    
    if (ctx.session.isAdmin) keyboard.text(ctx.t("modules.shared.sendout.view.sendout.main.sendout.buttons.condition"), `mainCondition:${sendoutName}`).row();
        
    keyboard.text(ctx.t("utils.shared.buttons.back"), "viewSendouts");
    return { text: format.escapeMarkdown(text), keyboard };
}

export default {
    viewSendout,
    viewSendouts
}