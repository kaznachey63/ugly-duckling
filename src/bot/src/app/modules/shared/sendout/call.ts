import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuCall from '@menus/modules/shared/sendout/call';
import common from '@utils/common';

const callComposer = new Composer<MyContext>();

callComposer.callbackQuery(/^mainSendoutCall:/, async (ctx: MyContext) => {
    try {    
        common.resetSessionStates(ctx.session);
        const menu = menuCall.main(ctx);

        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в mainSendoutCall:', error);
    } 
});

callComposer.callbackQuery(/^mainUpdateSendoutCall:/, async (ctx: MyContext) => {
    try {
        ctx.session.state.updatingSendoutCall = true;
        const menu = menuCall.update(ctx);

        const msg = await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });

        // Сохранение айди для последующего редактирования этого же сообщения
        if (typeof msg !== "boolean" && "message_id" in msg) {
            ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
        }
    } catch (error) {
        console.error('Ошибка в mainUpdateSendoutCall:', error);
    }
});

export default callComposer;