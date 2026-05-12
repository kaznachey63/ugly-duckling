import type { MyContext } from '@shared/types/SessionData';
import menuAddingIdea from '@menus/handlers/states/addingIdea';
import common from '@utils/common';
import db from '@shared/db';
import constants from '@constants';

export default async function addingIdea(ctx: MyContext) {
    let forwardResult = false;

    try {
        const result = await ctx.forwardMessage(constants.ids.generalChatId, {
            message_thread_id: constants.ids.ideaChatId
        })

        forwardResult = !!result;
        await db.general.updateIdeaLastMessageId(result.message_id);
    } catch (error) {
        console.error('Не удалось добавить идею:', error);
    }

    const menu = menuAddingIdea(ctx, forwardResult);
    common.resetSessionStates(ctx.session);

    await ctx.api.editMessageText(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState, menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}