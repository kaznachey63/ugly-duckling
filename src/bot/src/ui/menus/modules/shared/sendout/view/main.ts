import { InlineKeyboard } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import type { Menu } from '@shared/types/Menu';
import format from '@utils/formatting';
import type { Sendout } from '@shared/types/Sendout';

/**
 * Меню раздела рассылки
 */
function viewSendout(ctx: MyContext): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.sendout.name;
    const text = [
        ctx.t("modules.commands.cabinet.distribution.main.sendout.title", { call: ctx.session.sendout.call }),
        ctx.t("modules.commands.cabinet.distribution.main.sendout.path", { call: ctx.session.sendout.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
    .text(ctx.t("modules.commands.cabinet.distribution.main.sendout.buttons.messages"), `mainMessage:${nameDistribution}`).row()
        .text(ctx.t("modules.commands.cabinet.distribution.main.sendout.buttons.schedule"), `mainSchedule:${nameDistribution}`).row()
        .text(ctx.t("modules.commands.cabinet.distribution.main.sendout.buttons.statistics"), `mainStatistic:${nameDistribution}`).row()
    ;
    
    if (ctx.session.isAdmin) {
        keyboard.text(ctx.t("modules.commands.cabinet.distribution.main.sendout.buttons.condition"), `mainCondition:${nameDistribution}`).row();
    }
        
    keyboard.text(ctx.t("utils.shared.buttons.back"), "mainSendouts");
    return { text: format.escapeMarkdown(text), keyboard };
}

function viewSendouts(ctx: MyContext, sendouts: Sendout[]): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.commands.cabinet.distribution.main.sendouts.title", { count: sendouts.length }),
        ctx.t("modules.commands.cabinet.distribution.main.sendouts.path", { count: ctx.session.sendout.call }),
    ].join('\n\n');

    const keyboard = new InlineKeyboard();

    sendouts.forEach((cred) => {
        keyboard.text(
            cred.call ?? cred.label,
            `mainDistribution:${cred.name}`
        ).row();
    });    
    keyboard.text(ctx.t("utils.shared.buttons.back"), `mainCabinet`);

    return { text: format.escapeMarkdown(text), keyboard };
}

export default {
    viewSendout,
    viewSendouts
}