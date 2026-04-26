import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import mediaComposer from './media';
import textComposer from './text';
import messageComposer from './message';
import db from '@shared/db';
import menuView from '@menus/modules/shared/sendout/message/view';
import menuMessage from '@menus/modules/shared/sendout/message/main';

const viewComposer = new Composer<MyContext>();

viewComposer.callbackQuery(/^viewMessage:/, async (ctx: MyContext) => {
    ctx.session.other.text.positionId = Number(ctx.callbackQuery?.data!.split(/#/)[1]);
    
    const messages = await db.message.getMessages(ctx.session.sendout.schema);
    
    let menu;
    
    if (!messages?.length) menu = menuMessage(ctx, 0);
    else menu = menuView.main(ctx, messages);

    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

viewComposer.use(messageComposer);
viewComposer.use(textComposer);
viewComposer.use(mediaComposer);

export default viewComposer;