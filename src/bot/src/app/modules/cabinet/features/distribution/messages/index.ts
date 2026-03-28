import db from '@shared/db';
import common from "@utils/common";
import type { MyContext } from '@shared/types/SessionData';
import menuMessage from '@menus/modules/cabinet/distribution/message/main';
import { Composer } from 'grammy';
import viewComposer from './view';
import addComposer from './create';
import clearComposer from './clear';

const messageComposer = new Composer<MyContext>();

messageComposer.callbackQuery(/^mainMessage:/, async (ctx: MyContext) => {
    common.resetSessionStates(ctx.session);
    const nameDistribution = ctx.session.distribution.name!;
    
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
    
    ctx.session.other.text.positionId = messages.length;
    const menu = menuMessage.main(ctx, messages);
    const msg = await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });

    // Сохранение айди для последующего редактирования этого же сообщения
    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
    }
});

messageComposer.use(viewComposer);
messageComposer.use(addComposer);
messageComposer.use(clearComposer);

export default messageComposer;