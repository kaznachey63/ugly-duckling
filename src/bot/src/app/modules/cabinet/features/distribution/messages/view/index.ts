import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import mediaComposer from './media';
import textComposer from './text';
import messageComposer from './message';
import db from '@shared/db';
import menuView from '@menus/modules/cabinet/distribution/message/view';

const viewComposer = new Composer<MyContext>();

viewComposer.callbackQuery(/^viewMessage:/, async (ctx: MyContext) => {
    const nameDistribution = ctx.session.distribution.name!;
    ctx.session.other.text.positionId = Number(ctx.callbackQuery?.data!.split(/#/)[1]);

    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
    const menu = menuView.main(ctx, messages);

    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

viewComposer.use(messageComposer);
viewComposer.use(textComposer);
viewComposer.use(mediaComposer);

export default viewComposer;