import { Composer } from 'grammy';
import menuCreate from '@menus/modules/cabinet/sendout/message/create';
import menuView from '@menus/modules/cabinet/sendout/message/view';
import type { MyContext } from '@shared/types/SessionData';

const textComposer = new Composer<MyContext>();

textComposer.callbackQuery(/^mainCreateText:/, async (ctx: MyContext) => {
    ctx.session.other.text.positionId = Number(ctx.callbackQuery?.data!.split(/#/)[1]);

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

textComposer.callbackQuery(/^updateText:/, async (ctx: MyContext) => {
    ctx.session.state.updatingText = true;
    ctx.session.other.text.positionId = Number(ctx.callbackQuery?.data!.split(/#/)[1]);
    const menu = menuView.updateText(ctx);

    // Сохранение айди для последующего редактирования этого же сообщения
    const msg = await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });

    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
    }
});

export default textComposer;