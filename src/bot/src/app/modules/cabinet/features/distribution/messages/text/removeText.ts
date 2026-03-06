import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import menuText from "@menus/commands/cabinet/distribution/message/text";
import { ServerManager } from "@utils/ServerManager";

export default async function removeText(ctx: MyContext) {    
    const queryData = ctx.callbackQuery?.data;
    const nameDistribution = ctx.session.distribution.name!;
    const positionIndex = Number(queryData!.split(/:/)[1]) || 0;
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
    const messageId = messages[positionIndex]?.id!;

    await db.message.removeMessage(nameDistribution, messageId);
    const server = new ServerManager();
    const menu = menuText.remove(ctx, await server.restartProcessOrNot(nameDistribution));

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