import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import type { Time } from '@shared/types/Time';
import utils from '@utils';

function main(ctx: MyContext, times: Time[]): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.distribution.name;
    const callDistribution = ctx.session.distribution.call;

    let text = [];
    let keyboard = new InlineKeyboard();

    if (!times?.length) {
        text.push(ctx.t("commands.cabinet.distribution.schedule.main.noSchedule", { call: callDistribution }));
    }
    else {
        text.push(ctx.t("commands.cabinet.distribution.schedule.main.title"));

        for (const time of times) {
            keyboard.text(utils.local.formatTimeToRu(time)!, `updateOrRemoveTime:${nameDistribution}:${time.id}`).row();
        }
    }

    if (ctx.session.user.role == 'admin') {
        keyboard.text(ctx.t("commands.cabinet.distribution.schedule.main.buttons.parameters"), "parametersSchedule").row();

        if (times?.length! >= 6) {
            keyboard.text(ctx.t("commands.cabinet.distribution.schedule.main.buttons.clearSchedule"), `clearSchedule:${nameDistribution}`)
        }
        if (!times?.length) {
            keyboard.text(ctx.t("commands.cabinet.distribution.schedule.main.buttons.addTime"), `addTime:${nameDistribution}`)
        }
        keyboard.row();
    }
    keyboard.text(ctx.t("utils.shared.back"), `mainDistribution:${ctx.session.distribution.name}`);
    text.push(ctx.t("commands.cabinet.distribution.schedule.main.path", { call: callDistribution }));
    
    return { text: utils.formatting.escapeMarkdown(text.join('\n')), keyboard }
}

function add(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.schedule.add.title"),
        ctx.t("commands.cabinet.distribution.schedule.add.path", { call: ctx.session.distribution.call }),
    ].join('\n\n');
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainSchedule:${ctx.session.distribution.name}`);
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

function update(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.schedule.main.update.title"),
        ctx.t("commands.cabinet.distribution.schedule.main.update.path", { call: ctx.session.distribution.call }),
    ].join('\n\n');
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainSchedule:${ctx.session.distribution.name}`);
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

function remove(ctx: MyContext, listText: string[]): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard().text(ctx.t('utils.shared.back'), `mainDistribution:${ctx.session.distribution.name}`);
    const text = listText.map(t  => {
        return t.includes('path') ? ctx.t(t, { call: ctx.session.distribution.call }) : ctx.t(t);
    }).join('\n');

    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

function updateOrRemove(ctx: MyContext, targetTime: string): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.schedule.updateOrRemove.title", { targetTime: targetTime }),
        ctx.t("commands.cabinet.distribution.schedule.updateOrRemove.instruction"),
        ctx.t("commands.cabinet.distribution.schedule.updateOrRemove.path", { call: ctx.session.distribution.call })
    ].join('\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("commands.cabinet.distribution.schedule.updateOrRemove.buttons.update"))
        .text(ctx.t("commands.cabinet.distribution.schedule.updateOrRemove.buttons.remove"))
        .text(ctx.t('utils.shared.back'), `mainSchedule:${ctx.session.distribution.name}`);
    ;
    return { text: utils.formatting.escapeMarkdown(text), keyboard}
}

function adding(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.schedule.main.add.title"),
        ctx.t("commands.cabinet.distribution.schedule.main.add.path", { call: ctx.session.distribution.call }),
    ].join('\n\n');
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainSchedule:${ctx.session.distribution.name}`);
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

function updating(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.schedule.main.update.title"),
        ctx.t("commands.cabinet.distribution.schedule.main.update.path", { call: ctx.session.distribution.call }),
    ].join('\n\n');
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `mainSchedule:${ctx.session.distribution.name}`);
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

function clearSchedule(ctx: MyContext, listText: string[]): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard().text(ctx.t('utils.shared.back'), `mainSchedule:${ctx.session.distribution.name}`);
    const text = listText.map(t => {
        return t.includes('path') ? ctx.t(t, { call: ctx.session.distribution.call }) : ctx.t(t);
    }).join('\n');

    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

export default {
    main,
    add,
    update,
    remove,
    updateOrRemove,
    clearSchedule    
};