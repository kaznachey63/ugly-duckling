import { InlineKeyboard } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import type { Menu } from '@shared/types/Menu';
import format from '@utils/formatting';

export default async function main(ctx: MyContext): Promise<Menu<InlineKeyboard>> {
    const nameDistribution = ctx.session.distribution.name;
    const text = [
        ctx.t("commands.cabinet.distribution.main.title", { call: ctx.session.distribution.call }),
        ctx.t("commands.cabinet.distribution.main.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    let keyboard = new InlineKeyboard()
        .text(ctx.t("commands.cabinet.distribution.main.buttons.contract"), `mainContract${nameDistribution}`).row()
    ;
    
    if (ctx.session.user.role == 'admin' || await db.user.userIsFather(ctx.from?.id!)) {
        keyboard.text(ctx.t("commands.cabinet.distribution.main.buttons.chats"), `mainChats${nameDistribution}`).row()
    }
    
    keyboard
        .text(ctx.t("commands.cabinet.distribution.main.buttons.schedule"), `mainSchedule${nameDistribution}`).row()
        .text(ctx.t("commands.cabinet.distribution.main.buttons.messages"), `mainMessage${nameDistribution}`).row()
        .text(ctx.t("commands.cabinet.distribution.main.buttons.statistics"), `mainStatistics${nameDistribution}`).row()
    ;
    
    if (ctx.session.user.role == 'admin') {
        keyboard.text(ctx.t("commands.cabinet.distribution.main.buttons.condition"), `mainCondition${nameDistribution}`).row();
    }
        
    keyboard.text(ctx.t('utils.shared.back'), "mainCabinet");
    return { text: format.escapeMarkdown(text), keyboard };
}