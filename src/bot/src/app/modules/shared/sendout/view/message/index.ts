import db from '@shared/db';
import common from "@utils/common";
import type { MyContext } from '@shared/types/SessionData';
import menuMessage from '@menus/modules/shared/sendout/view/message/main';
import { Composer } from 'grammy';
import viewComposer from './view';
import addComposer from './create';
import clearComposer from './clear';
import exportComposer from './export';

const messageComposer = new Composer<MyContext>();

messageComposer.callbackQuery(/^mainMessage:/, async (ctx: MyContext) => {
    common.resetSessionStates(ctx.session);
    let menu;
    const messages = await db.message.getMessages(ctx.session.sendout.id!);
    if (!messages) {
        menu = menuMessage(ctx, 0, true);
    }
    else {
        ctx.session.message.position = messages.length;
        menu = menuMessage(ctx, messages.length, false);
    }

    try {
        const msg = await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });

        // Сохранение айди для последующего редактирования этого же сообщения
        if (typeof msg !== "boolean" && "message_id" in msg) {
            ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
        }
    } catch {
        await ctx.api.deleteMessage(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState);
        const msg = await ctx.reply(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });

        // Сохранение айди для последующего редактирования этого же сообщения
        if (typeof msg !== "boolean" && "message_id" in msg) {
            ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
        }
    }
});

messageComposer.use(viewComposer);
messageComposer.use(addComposer);
messageComposer.use(clearComposer);
messageComposer.use(exportComposer);

export default messageComposer;