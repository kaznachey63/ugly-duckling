import db from "@shared/db";
import utils from "src/common/utils";
import type { MyContext } from '@shared/types/SessionData';
import menuChat from "@menus/commands/cabinet/distribution/chats";

/**
 * Главная страница раздела чаты
 */
export default async function mainChat(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!;
    const logsBaza = await db.result.getResults(nameDistribution);
    if (!logsBaza) return;

    const lastLog = logsBaza.at(-1)!;
    const infoChats = await db.chat.getChatsInfo(lastLog?.chats);
    
    if (logsBaza.length === 0 || !lastLog?.chats || !infoChats) {
        // Если рассылки нет        
        await ctx.answerCallbackQuery({ text: ctx.t("commands.cabinet.distribution.chats.noSendout", { call: ctx.session.distribution.call }), show_alert: true });
        return;
    }
    
    const menu = menuChat(ctx, lastLog.success, infoChats!)
    await ctx.editMessageText(utils.formatting.escapeMarkdown(menu.text),
        {
            parse_mode: "MarkdownV2",
            reply_markup: menu.keyboard
        }
    );
}