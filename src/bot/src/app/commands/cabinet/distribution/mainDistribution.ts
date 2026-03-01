import type { MyContext } from '@shared/types/SessionData';
import menuMain from "@menus/commands/cabinet/distribution/main";
import { GrammyError } from 'grammy';

/**
 * Отображение меню рассылки (разделы рассылки)
 */
export default async function mainDistribution(ctx: MyContext) {
    const menu = await menuMain(ctx);
    try {
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        });   
    } catch (error) {
        // 🎯 Перехватываем именно эту ошибку Telegram
        if (error instanceof GrammyError && error.description?.includes("message is not modified")) {
            return;
        }
        throw error;
    }
}