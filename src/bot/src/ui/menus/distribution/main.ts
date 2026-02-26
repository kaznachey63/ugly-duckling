import { InlineKeyboard } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import type { Menu } from '@shared/types/Menu';

export default async function main(ctx: MyContext): Promise<Menu<InlineKeyboard>> {
    const nameDistribution = ctx.session.distribution.name;
    const text = [
        ctx.t('distribution.main.title', { call: ctx.session.distribution.call }),
        ctx.t('distribution.main.path', { call: ctx.session.distribution.call })
    ].join('\n\n');

    let keyboard = new InlineKeyboard()
        .text(ctx.t('distribution.main.buttons.contract'), `mainContract${nameDistribution}`).row()
    ;
    
    if (ctx.session.role == 'admin' || await db.user.userIsFather(ctx.from?.id!)) {
        keyboard.text(ctx.t('distribution.main.buttons.chats'), `mainChats${nameDistribution}`).row()
    }
    
    keyboard
        .text(ctx.t('distribution.main.buttons.schedule'), `mainschedule${nameDistribution}`).row()
        .text(ctx.t('distribution.main.buttons.messages'), `mainMessages${nameDistribution}`).row()
        .text(ctx.t('distribution.main.buttons.statistics'), `mainStatistics${nameDistribution}`).row()
    ;
    
    // if (ctx.session.role == 'admin') {
        keyboard.text(ctx.t('distribution.main.buttons.condition'), `mainCondition${nameDistribution}`).row();
    // }
        
    keyboard.text(ctx.t('nav.back'), 'mainDistribution');
    return { text, keyboard };
}