import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';
import utils from '@utils';
import type { Schedule } from '@shared/types/DB';

function main(ctx: MyContext, times: Schedule[]): Menu<InlineKeyboard> {
    const sendoutId = ctx.session.sendout.id;
    const text = [
        ctx.t("modules.shared.sendout.view.schedule.view.main.title"),
        ctx.t("modules.shared.sendout.view.schedule.view.main.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n');

    let keyboard = new InlineKeyboard();

    for (const time of times) {
        keyboard.text(time.label!, `updateOrRemoveTime:${sendoutId}#${time.id}`).row();
    }

    keyboard.row().text(ctx.t("utils.shared.buttons.back"), `mainSchedule:${sendoutId}`);
    
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

function update(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.shared.sendout.view.schedule.view.time.update.title"),
        ctx.t("modules.shared.sendout.view.schedule.view.time.update.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") }),
    ].join('\n\n');
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `updateOrRemoveTime:${ctx.session.sendout.id}#${ctx.session.schedule.id}`)
    return { text: format.escapeMarkdown(text), keyboard }
}

function remove(ctx: MyContext, resultRestart: boolean): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `viewSchedule:${ctx.session.sendout.id}`);
    const text = [
        resultRestart ? 
            ctx.t("modules.shared.sendout.view.schedule.view.time.remove.success") :
            ctx.t("modules.shared.sendout.view.schedule.view.time.remove.remove")
        ,
        ctx.t("modules.shared.sendout.view.schedule.view.time.remove.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n\n');

    return { text: format.escapeMarkdown(text), keyboard }
}

function updateOrRemove(ctx: MyContext, targetTime: string): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.shared.sendout.view.schedule.view.time.updateOrRemove.title", { targetTime: targetTime }),
        ctx.t("modules.shared.sendout.view.schedule.view.time.updateOrRemove.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("utils.shared.buttons.update"), `updateTime:${ctx.session.sendout.id}#${ctx.session.schedule.id}`)
        .text(ctx.t("utils.shared.buttons.remove"), `removeTime:${ctx.session.sendout.id}#${ctx.session.schedule.id}`).style('danger')
        .row().text(ctx.t("utils.shared.buttons.back"), `mainSchedule:${ctx.session.sendout.id}`);
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    main,
    update,
    remove,
    updateOrRemove,
}