import db from "@shared/db";
import format from "@utils/formatting";
import type { MyContext } from '@shared/types/SessionData';

/**
 * Главная страница раздела чаты
 */
export default async function chatsForStatistics(ctx: MyContext) {
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

    const menu = chat(ctx, lastLog.success, infoChats!)
    await ctx.editMessageText(format.escapeMarkdown(menu.text),
        {
            parse_mode: "MarkdownV2",
            reply_markup: menu.keyboard
        }
    );
}

import { InlineKeyboard } from "grammy";
import type { Chat } from "@shared/types/Chat";
import type { Menu } from "@shared/types/Menu";

/**
 * Меню раздела чаты
 */
function chat(ctx: MyContext, success: number, chats: Chat[]): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.chats.amount", { success: success }),
        ctx.t("commands.cabinet.distribution.chats.path", { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard();
    chats.forEach((chat: Chat) => {
        keyboard.url(
            chat.title,
            chat.link
        ).row();
    });
    keyboard.text(ctx.t("utils.shared.back"), "mainDistribution");
    return { text: format.escapeMarkdown(text), keyboard }
}