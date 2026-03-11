import { Composer } from 'grammy';
import menuAdd from '@menus/modules/cabinet/distribution/message/add';
import menuRead from '@menus/modules/cabinet/distribution/message/read';
import type { MyContext } from '@shared/types/SessionData';

const textComposer = new Composer<MyContext>();

textComposer.callbackQuery(/^mainAddText:/, async (ctx: MyContext) => {
    ctx.session.state.text.positionId = Number(ctx.callbackQuery?.data!.split(/#/)[1]);

    const menu = menuAdd.main(ctx);
    const msg = await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });

    // Сохранение айди для последующего редактирования этого же сообщения
    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.state.ids.idForUpdateMessageFromState = msg.message_id;
    }
});

textComposer.callbackQuery(/^updateText:/, async (ctx: MyContext) => {
    ctx.session.state.text.updating = true;
    ctx.session.state.text.positionId = Number(ctx.callbackQuery?.data!.split(/#/)[1]);
    const menu = menuRead.updateText(ctx);

    // Сохранение айди для последующего редактирования этого же сообщения
    const msg = await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });

    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.state.ids.idForUpdateMessageFromState = msg.message_id;
    }
});

export default textComposer;