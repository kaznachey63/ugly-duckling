import type { MyContext } from '@shared/types/SessionData';
import menuCreate from '@menus/modules/cabinet/sendout/message/create';
import { Composer } from 'grammy';

const handComposer = new Composer<MyContext>();

handComposer.callbackQuery(/^handInputText:/, async (ctx: MyContext) => {
    ctx.session.state.addingText = true;
    ctx.session.other.text.positionId = Number(ctx.callbackQuery?.data!.split(/#/)[1]);
    const menu = menuCreate.hand(ctx);

    const msg = await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });

    // Сохранение айди для последующего редактирования этого же сообщения
    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
    }
});

export default handComposer;