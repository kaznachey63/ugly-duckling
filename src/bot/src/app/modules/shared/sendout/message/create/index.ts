import type { MyContext } from '@shared/types/SessionData';
import { Composer } from 'grammy';
import genereteComposer from './generate';
import handComposer from './hand';
import menuCreate from '@menus/modules/shared/sendout/message/create';
import common from '@utils/common';

const createComposer = new Composer<MyContext>();

createComposer.callbackQuery(/^mainCreateText:/, async (ctx: MyContext) => {
    if (ctx.session.sendout.active) {
        await common.alertSendoutIsActive(ctx);
        return;
    }

    const menu = menuCreate.main(ctx);
    const msg = await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });

    // Сохранение айди для последующего редактирования этого же сообщения
    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
    }
});

createComposer.use(genereteComposer);
createComposer.use(handComposer);

export default createComposer;