import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';
import type { Time } from '@shared/types/Time'; 
import utils from '@utils';

function main(ctx: MyContext, times: Time[]): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.distribution.name;
    const callDistribution = ctx.session.distribution.call;

    const text = [
        ctx.t("commands.cabinet.distribution.schedule.view.main.title"),
        ctx.t("commands.cabinet.distribution.schedule.view.main.path", { call: callDistribution })
    ].join('\n\n');

    let keyboard = new InlineKeyboard();

    for (const time of times) {
        keyboard.text(utils.local.formatTimeToRu(time)!, `updateOrRemoveTime:${nameDistribution}:${time.id}`).row();
    }

    keyboard.row().text(ctx.t("utils.shared.back"), `mainSchedule:${ctx.session.distribution.name}`);
    
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

function update(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.schedule.view.time.update.title"),
        ctx.t("commands.cabinet.distribution.schedule.view.time.update.path", { call: ctx.session.distribution.call }),
    ].join('\n\n');
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainSchedule:${ctx.session.distribution.name}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function remove(ctx: MyContext, times: string[]): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard().text(ctx.t('utils.shared.back'), `mainSchedule:${ctx.session.distribution.name}`);
    const text = times.map(t => {
        return t.includes('path') ? ctx.t(t, { call: ctx.session.distribution.call }) : ctx.t(t);
    }).join('\n');

    return { text: format.escapeMarkdown(text), keyboard }
}

function updateOrRemove(ctx: MyContext, targetTime: string): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.schedule.time.updateOrRemove.title", { targetTime: targetTime }),
        ctx.t("commands.cabinet.distribution.schedule.time.updateOrRemove.instruction"),
        ctx.t("commands.cabinet.distribution.schedule.time.updateOrRemove.path", { call: ctx.session.distribution.call })
    ].join('\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("commands.cabinet.distribution.schedule.time.updateOrRemove.buttons.update"))
        .text(ctx.t("commands.cabinet.distribution.schedule.time.updateOrRemove.buttons.remove"))
        .text(ctx.t('utils.shared.back'), `mainSchedule:${ctx.session.distribution.name}`);
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    main,
    update,
    remove,
    updateOrRemove,
}