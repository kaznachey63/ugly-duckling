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
    ].join('\n');

    let keyboard = new InlineKeyboard();

    for (const time of times) {
        keyboard.text(utils.local.formatTimeToRu(time)!, `updateOrRemoveTime:${nameDistribution}#${time.id}`).row();
    }

    keyboard.row().text(ctx.t("utils.shared.back"), `mainSchedule:${ctx.session.distribution.name}`);
    
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

function update(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.schedule.view.time.update.title"),
        ctx.t("commands.cabinet.distribution.schedule.view.time.update.path", { call: ctx.session.distribution.call }),
    ].join('\n\n');
    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.back"), `viewSchedule:${ctx.session.distribution.name}`);
    return { text: format.escapeMarkdown(text), keyboard }
}

function remove(ctx: MyContext, resultRestart: boolean): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard().text(ctx.t('utils.shared.back'), `viewSchedule:${ctx.session.distribution.name}`);
    const text = [
        resultRestart ? 
            ctx.t('commands.cabinet.distribution.schedule.view.time.remove.success') :
            ctx.t('commands.cabinet.distribution.schedule.view.time.remove.remove')
        ,
        '\n',
        ctx.t('commands.cabinet.distribution.schedule.view.time.remove.path', { call: ctx.session.distribution.call })
    ].join('\n');

    return { text: format.escapeMarkdown(text), keyboard }
}

function updateOrRemove(ctx: MyContext, targetTime: string): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.schedule.view.time.updateOrRemove.title", { targetTime: targetTime }),
        '\n',
        ctx.t("commands.cabinet.distribution.schedule.view.time.updateOrRemove.path", { call: ctx.session.distribution.call })
    ].join('\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("commands.cabinet.distribution.schedule.view.time.updateOrRemove.buttons.update"), `updateTime:${ctx.session.distribution.name}`)
        .text(ctx.t("commands.cabinet.distribution.schedule.view.time.updateOrRemove.buttons.remove"), `removeTime:${ctx.session.distribution.name}`).style('danger')
        .row().text(ctx.t('utils.shared.back'), `mainSchedule:${ctx.session.distribution.name}`);
    ;
    return { text: format.escapeMarkdown(text), keyboard }
}

export default {
    main,
    update,
    remove,
    updateOrRemove,
}