import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import menuText from "@menus/commands/cabinet/distribution/sections/message/text";
import { ServerManager } from "@utils/ServerManager";

export default async function deleteText(ctx: MyContext) {    
    const queryData = "data" in ctx.callbackQuery! ? ctx.callbackQuery.data : null;
    const nameDistribution = ctx.session.distribution.name!;
    const positionIndex = Number(queryData!.split(/:/)[1]) || 0;
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
    const messageId = messages[positionIndex]?.id!;

    let text = [];
    if (!String(nameDistribution) || !Number(messageId)) {
        text.push("distribution.sections.messages.text.remove.error");
    }
    else {
        await db.message.removeMessage(nameDistribution, messageId);
        const server = new ServerManager();
        if (await server.restartProcessOrNot(nameDistribution)) {
            text.push("distribution.sections.messages.text.remove.success");
        }
        else {
            text.push("distribution.sections.messages.text.remove.error");
        }
    }
    text.push(ctx.t("distribution.sections.messages.text.remove.path", { call: ctx.session.distribution.call }));
    const menu = menuText.remove(ctx, text);

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