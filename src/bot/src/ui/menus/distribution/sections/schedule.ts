import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import type { Time } from '@shared/types/Time';
import utils from '@utils';
import format from '@utils/formatting';

function main(ctx: MyContext, times: Time[]): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.distribution.name;
    const callDistribution = ctx.session.distribution.call;

    let text = [];
    let keyboard = new InlineKeyboard();

    if (!times?.length) {
        text.push(ctx.t("distribution.section.schedule.main.noSchedule", { call: callDistribution }));
    }
    else {
        text.push(ctx.t("distribution.section.schedule.main.title"));

        for (const time of times) {
            keyboard.text(utils.local.formatTimeToRu(time)!, `updateOrRemoveTime${nameDistribution}:${time.id}`).row();
        }
    }

    if (ctx.session.role == 'admin') {
        keyboard.text(ctx.t("distribution.section.schedule.main.buttons.parameters"), "parametrsTime").row();

        if (times?.length! >= 6) {
            keyboard.text(ctx.t("distribution.section.schedule.main.buttons.addTime"), `addTime${nameDistribution}`)
        }
        if (!times?.length) {
            keyboard.text(ctx.t("distribution.section.schedule.main.buttons.clearAll"), `removeAllTime${nameDistribution}`)
        }
    }
    keyboard.text("nav.back", "mainDistribution");
    text.push("distribution.section.schedule.main.path", { call: callDistribution });

    return { text: format.escapeMarkdown(text.join('\n')), keyboard }
}

function add(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("distribution.section.schedule.main.add.title"),
        ctx.t("distribution.section.schedule.main.add.path", { call: ctx.session.distribution.call }),
    ].join('\n\n');
    const keyboard = new InlineKeyboard().text(ctx.t("nav.back"), `mainTime${ctx.session.distribution.name}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function update(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("distribution.section.schedule.main.update.title"),
        ctx.t("distribution.section.schedule.main.update.path", { call: ctx.session.distribution.call }),
    ].join('\n\n');
    const keyboard = new InlineKeyboard().text(ctx.t("nav.back"), `mainTime${ctx.session.distribution.name}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function remove(ctx: MyContext, listText: string[]): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard().text(ctx.t('nav.back'), 'mainDistribution');
    const text = listText.map(t  => {
        return t.includes('path') ? ctx.t(t, { call: ctx.session.distribution.call }) : ctx.t(t);
    }).join('\n');

    return { text: format.escapeMarkdown(text), keyboard }
}

function updateOrRemove(ctx: MyContext, targetTime: string): Menu<InlineKeyboard> {
    const text = [
        ctx.t("distribution.section.schedule.updateOrRemove.title", { targetTime: targetTime }),
        ctx.t("distribution.section.schedule.updateOrRemove.instruction"),
        ctx.t("distribution.section.schedule.updateOrRemove.path", { call: ctx.session.distribution.call })
    ].join('\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("distribution.section.schedule.updateOrRemove.buttons.update"))
        .text(ctx.t("distribution.section.schedule.updateOrRemove.buttons.remove"))
        .text(ctx.t('nav.back'), 'mainSchedule');
    ;
    return { text: format.escapeMarkdown(text), keyboard}
}

function adding(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("distribution.section.schedule.main.add.title"),
        ctx.t("distribution.section.schedule.main.add.path", { call: ctx.session.distribution.call }),
    ].join('\n\n');
    const keyboard = new InlineKeyboard().text(ctx.t("nav.back"), `mainTime${ctx.session.distribution.name}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function updating(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("distribution.section.schedule.main.update.title"),
        ctx.t("distribution.section.schedule.main.update.path", { call: ctx.session.distribution.call }),
    ].join('\n\n');
    const keyboard = new InlineKeyboard().text(ctx.t("nav.back"), `mainTime${ctx.session.distribution.name}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function clearAll(ctx: MyContext, listText: string[]): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard().text(ctx.t('nav.back'), 'mainDistribution');
    const text = listText.map(t => {
        return t.includes('path') ? ctx.t(t, { call: ctx.session.distribution.call }) : ctx.t(t);
    }).join('\n');

    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    main,
    add,
    update,
    remove,
    updateOrRemove,
    clearAll    
};