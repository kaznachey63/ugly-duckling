import type { MyContext } from '@shared/types/SessionData';
import menuAddMessage from '@menus/commands/cabinet/distribution/message/add';
import { Composer } from 'grammy';

const addMessageComposer = new Composer<MyContext>();

addMessageComposer.callbackQuery(/^generateText:/, async (ctx: MyContext) => {
    ctx.session.state.text.generating = true;
    ctx.session.state.text.positionId = Number(ctx.callbackQuery?.data!.split(/#/)[1]);
    const menu = menuAddMessage.generate(ctx);
    
    const msg = await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });

    // Сохранение айди для последующего редактирования этого же сообщения
    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.state.ids.idForUpdateMessageFromState = msg.message_id;
    }
});

addMessageComposer.callbackQuery(/^handInputText:/, async (ctx: MyContext) => {
    ctx.session.state.text.adding = true;
    ctx.session.state.text.positionId = Number(ctx.callbackQuery?.data!.split(/#/)[1]);
    const menu = menuAddMessage.hand(ctx);

    const msg = await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });

    // Сохранение айди для последующего редактирования этого же сообщения
    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.state.ids.idForUpdateMessageFromState = msg.message_id;
    }
});

// import textComposer from './text';
// import mediaComposer from './media';
// addMessageComposer.use(textComposer);
// addMessageComposer.use(mediaComposer);

export default addMessageComposer;