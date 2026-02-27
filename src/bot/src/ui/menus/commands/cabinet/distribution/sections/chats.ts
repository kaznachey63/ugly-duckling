import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Chat } from "@shared/types/Chat";
import type { Menu } from "@shared/types/Menu";

/**
 * Меню раздела чаты
 */
export default function chat(ctx: MyContext, success: number, chats: Chat[]): Menu<InlineKeyboard> {
    const text = [
        ctx.t('distribution.sections.chats.amount', { success: success }),
        ctx.t('distribution.sections.chats.path', { call: ctx.session.distribution.call })
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard();
    chats.forEach((chat: Chat) => {
        keyboard.url(
            chat.title,
            chat.link
        ).row();
    });
    keyboard.text(ctx.t("nav.back"), "mainDistribution");
    return { text, keyboard }
}