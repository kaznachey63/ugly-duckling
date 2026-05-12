import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuCreate from '@menus/modules/shared/sendout/schedule/create';
import common from '@utils/common';

const createComposer = new Composer<MyContext>();

createComposer.callbackQuery(/^createTime:/, async (ctx: MyContext) => {
    if (ctx.session.sendout.active) {
        await common.alertSendoutIsActive(ctx);
        return;
    }   
    try {
        ctx.session.state.addingTime = true;
        const menu = menuCreate(ctx);

        const msg = await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });

        if (typeof msg !== 'boolean' && 'message_id' in msg) {
            ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
        }
    } catch (error) {
        console.error('Ошибка в addTime:', error);
    } finally {
        
    }
});

export default createComposer;