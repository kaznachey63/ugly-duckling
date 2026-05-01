import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import mediaComposer from './media';
import textComposer from './text';
import messageComposer from './message';
import db from '@shared/db';
import menuView from '@menus/modules/shared/sendout/view/message/view';
import menuMessage from '@menus/modules/shared/sendout/view/message/main';
import type { PaginationType } from '@shared/types/PaginationType';

const viewComposer = new Composer<MyContext>();

viewComposer.callbackQuery(/^viewMessage:(\d+)#(\d+)-(prev|next|none)$/, async (ctx: MyContext) => {
    const messages = await db.message.getMessages(ctx.session.sendout.id!);
    let menu;

    if (!messages?.length) {
        menu = menuMessage(ctx, 0, false);
    }
    else {
        const callbackData = ctx.callbackQuery?.data!;

        const messagePosition = Number(callbackData.split('#')[1]!.split('-')[0]);
        const type = (callbackData.split('-')[1] ?? "none") as PaginationType;

        ctx.session.message = (await db.message.getByIdForPagination(ctx.session.sendout.id!, messagePosition, type))!;
        menu = menuView.main(ctx, messages.length);
    }

    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
});

viewComposer.use(messageComposer);
viewComposer.use(textComposer);
viewComposer.use(mediaComposer);

export default viewComposer;