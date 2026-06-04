import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuName from '@menus/modules/shared/sendout/name';
import common from '@utils/common';

const callComposer = new Composer<MyContext>();

callComposer.callbackQuery(/^mainSendoutNames:/, async (ctx: MyContext) => {
    try {    
        common.resetSessionStates(ctx.session);
        const menu = menuName.main(ctx);

        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в mainSendoutNames:', error);
    } 
});

callComposer.callbackQuery(/^mainUpdateSendoutCall:/, async (ctx: MyContext) => {
    try {
        ctx.session.state.updatingSendoutCall = true;
        const menu = menuName.updateCall(ctx);

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

callComposer.callbackQuery(/^mainUpdateSendoutLabel:/, async (ctx: MyContext) => {
    try {
       await ctx.answerCallbackQuery({ show_alert: true, text: ctx.t("modules.shared.sendout.view.name.update.label.alert")})
    } catch (error) {
        console.error('Ошибка в mainUpdateSendoutLabel:', error);
    }
});

callComposer.callbackQuery(/^mainUpdateSendoutName:/, async (ctx: MyContext) => {
    try {
       await ctx.answerCallbackQuery({ show_alert: true, text: ctx.t("modules.shared.sendout.view.name.update.name.alert")})
    } catch (error) {
        console.error('Ошибка в mainUpdateSendoutName:', error);
    }
});

export default callComposer;