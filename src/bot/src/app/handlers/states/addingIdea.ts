import type { MyContext } from '@shared/types/SessionData';
import menuState from '@menus/handlers/states';
import common from '@utils/common';
import db from '@shared/db';
import constants from '@constants';

export default async function addingIdea(ctx: MyContext) {
    let forwardResult = false;

    try {
const result = await ctx.api.copyMessage(
  -1003760118458,
  ctx!.chat!.id!,
  ctx!.message!.message_id,
  {
    message_thread_id: 81
  }
);
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