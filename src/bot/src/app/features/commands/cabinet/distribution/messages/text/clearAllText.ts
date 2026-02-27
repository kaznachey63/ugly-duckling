import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import { ServerManager } from "@utils/ServerManager";
import menuText from "@menus/commands/cabinet/distribution/sections/message/text";

export default async function deleteText(ctx: MyContext) {    
    const nameDistribution = ctx.session.distribution.name!;
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;

    let text = [];
    if (!String(nameDistribution)) {
        text.push("distribution.sections.messages.text.clearAll.error");
    }
    else {
        await db.message.removeAllMessage(nameDistribution);
        const server = new ServerManager();
        if (await server.restartProcessOrNot(nameDistribution)) {
            text.push("distribution.sections.messages.text.clearAll.success");
        }
        else {
            text.push("distribution.sections.messages.text.clearAll.error");
        }
    }
    text.push("distribution.sections.messages.text.clearAll.path");
    const menu = menuText.clearAll(ctx, text);

    try {
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        });
    } catch {
        await ctx.reply(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        });
    }
};