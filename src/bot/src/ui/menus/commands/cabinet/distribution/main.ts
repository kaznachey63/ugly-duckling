import { InlineKeyboard } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import type { Menu } from '@shared/types/Menu';

export default async function main(ctx: MyContext): Promise<Menu<InlineKeyboard>> {
    const nameDistribution = ctx.session.distribution.name;
    const text = [
        ctx.t(commands.cabinet.distribution.main.title', { call: ctx.session.distribution.call }),
        ctx.t(commands.cabinet.distribution.main.path', { call: ctx.session.distribution.call })
    ].join('\n\n');

    let keyboard = new InlineKeyboard()
        .text(ctx.t(commands.cabinet.distribution.main.buttons.contract'), `mainContract${nameDistribution}`).row()
    ;
    
    if (ctx.session.role == 'admin' || await db.user.userIsFather(ctx.from?.id!)) {
        keyboard.text(ctx.t(commands.cabinet.distribution.main.buttons.chats'), `mainChats${nameDistribution}`).row()
    }
    
    keyboard
        .text(ctx.t(commands.cabinet.distribution.main.buttons.schedule'), `mainSchedule${nameDistribution}`).row()
        .text(ctx.t(commands.cabinet.distribution.main.buttons.messages'), `mainMessage${nameDistribution}`).row()
        .text(ctx.t(commands.cabinet.distribution.main.buttons.statistics'), `mainStatistics${nameDistribution}`).row()
    ;
    
    if (ctx.session.role == 'admin') {
        keyboard.text(ctx.t(commands.cabinet.distribution.main.buttons.condition'), `mainCondition${nameDistribution}`).row();
    }
        
    keyboard.text(ctx.t('nav.back'), `mainDistribution${ctx.session.distribution.name}`);
    return { text, keyboard };
}