import type { MyContext } from '@shared/types/SessionData';
import menuState from '@menus/handlers/states';
import common from '@utils/common';
import db from '@shared/db';
import constants from '@constants';

export default async function addingIdea(ctx: MyContext) {
    let forwardResult = false;

    try {
        const result = await ctx.api.forwardMessage(constants.ids.generalChatId, ctx.chatId!, ctx.message?.message_id!, {
            direct_messages_topic_id: constants.ids.ideaChatId
        });
        console.log(result);
        
        forwardResult = !!result;
        await db.bot.updateIdeaLastMessageId(result.message_id);
    } catch (error) {
        console.error('Не удалось добавить идею:', error);
    }

    const menu = menuState.addingIdea(ctx, forwardResult);
    common.resetSessionStates(ctx.session);

    await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}