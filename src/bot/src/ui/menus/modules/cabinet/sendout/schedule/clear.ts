import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import format from '@utils/formatting';

export default function clear(ctx: MyContext, resultRestart: boolean): Menu<InlineKeyboard> {
    const keyboard = new InlineKeyboard().text(ctx.t('utils.shared.buttons.back'), `mainSchedule:${ctx.session.sendout.name}`);
    const text = [
        resultRestart ? 
            ctx.t('commands.cabinet.distribution.schedule.clear.success') :
            ctx.t('commands.cabinet.distribution.schedule.clear.error')
        ,
        ctx.t('commands.cabinet.distribution.schedule.clear.path', { call: ctx.session.sendout.call }),
    ].join('\n\n');

    return { text: format.escapeMarkdown(text), keyboard }
}