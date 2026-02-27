import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import { ServerManager } from "@utils/ServerManager";
import menuText from "@menus/commands/cabinet/distribution/message/text";

export default async function clearAll(ctx: MyContext) {    
    const nameDistribution = ctx.session.distribution.name!;
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;

    await db.message.removeAllMessage(nameDistribution);
    const server = new ServerManager();
    const menu = menuText.clearAll(ctx, await server.restartProcessOrNot(nameDistribution));

    try {
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        });
    } catch (error) {
        await ctx.reply(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        });
    }
};