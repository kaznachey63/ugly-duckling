import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuText from '@menus/commands/cabinet/distribution/message/text';
import { ServerManager } from "@utils/ServerManager";

export default async function editingText(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!;
    const positionIndex = ctx.session.typePartition.text.id!;
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
    const messageId = messages[positionIndex]?.id!;

    await db.message.updateMessage(nameDistribution, messageId, {
        caption: ctx.message?.text?.trim()!,
        entities: ctx.message?.entities!,
    });

    const server = new ServerManager();
    const menu = menuText.updating(ctx, await server.restartProcessOrNot(nameDistribution));

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
}