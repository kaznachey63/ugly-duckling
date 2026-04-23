import { InlineKeyboard } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import type { Menu } from '@shared/types/Menu';
import format from '@utils/formatting';
import type { Sendout } from '@shared/types/Sendout';
import common from '@utils/common';

function mainSendout(ctx: MyContext): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.sendout.name;
    const text = [
        ctx.t("commands.cabinet.distribution.main.sendout.title", { call: ctx.session.sendout.call }),
        ctx.t("commands.cabinet.distribution.main.sendout.path", { call: ctx.session.sendout.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("commands.cabinet.distribution.main.sendout.buttons.schedule"), `mainSchedule:${nameDistribution}`).row()
        .text(ctx.t("commands.cabinet.distribution.main.sendout.buttons.messages"), `mainMessage:${nameDistribution}`).row()
        .text(ctx.t("commands.cabinet.distribution.main.sendout.buttons.statistics"), `mainStatistic:${nameDistribution}`).row()
    ;
    
    if (common.isAdmin(ctx.session.user.role)) {
        keyboard.text(ctx.t("commands.cabinet.distribution.main.sendout.buttons.condition"), `mainCondition:${nameDistribution}`).row();
    }
        
    keyboard.text(ctx.t('utils.shared.back'), "mainSendouts");
    return { text: format.escapeMarkdown(text), keyboard };
}

function mainSendouts (ctx: MyContext, sendouts: Sendout[]): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.main.sendouts.title", { count: sendouts.length })
    ].join('\n');

    const keyboard = new InlineKeyboard();

    sendouts.forEach((cred) => {
        keyboard.text(
            cred.call,
            `mainDistribution:${cred.name}`
        ).row();
    });    
    keyboard.text(ctx.t("utils.shared.back"), `mainCabinet`)

    return { text: format.escapeMarkdown(text), keyboard };
}

export default {
    mainSendout,
    mainSendouts
}