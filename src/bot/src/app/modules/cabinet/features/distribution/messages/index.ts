import db from '@shared/db';
import common from "@utils/common";
import type { MyContext } from '@shared/types/SessionData';
import menuMessage from '@menus/modules/cabinet/distribution/message';
import { Composer } from 'grammy';
import readComposer from './read';
import addComposer from './add';
import clearComposer from './clear';

const messageComposer = new Composer<MyContext>();

messageComposer.callbackQuery(/^mainMessage:/, async (ctx: MyContext) => {
    common.resetSessionStates(ctx.session);
    const nameDistribution = ctx.session.distribution.name!;
    
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
    
    ctx.session.state.text.positionId = messages.length;
    const menu = menuMessage.main(ctx, messages);
    const msg = await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });

    // Сохранение айди для последующего редактирования этого же сообщения
    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.state.ids.idForUpdateMessageFromState = msg.message_id;
    }
});

messageComposer.use(readComposer);
messageComposer.use(addComposer);
messageComposer.use(clearComposer);

export default messageComposer;