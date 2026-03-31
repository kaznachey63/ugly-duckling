import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuIdea from '@menus/modules/settings/idea';
import db from '@shared/db';

const ideaComposer = new Composer<MyContext>();

ideaComposer.callbackQuery('mainIdea', async (ctx: MyContext) => {
    try {
        const lastMessageId = String((await db.bot.getLastMessage()).id ?? 1);
        const menu = menuIdea.main(ctx, lastMessageId);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в mainIdea:', error);
    } 
});

ideaComposer.callbackQuery('addIdea', async (ctx: MyContext) => {
    ctx.session.state.addingIdea = true;
    try {
        const menu = menuIdea.add(ctx);
        const msg = await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
        
        if (typeof msg !== "boolean" && "message_id" in msg) {
            ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
        }
    } catch (error) {
        console.error('Ошибка в addIdea:', error);
    } 
});

export default ideaComposer;