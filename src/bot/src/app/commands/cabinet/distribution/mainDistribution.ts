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
            // Это не баг, а фича: контент не изменился, редактировать нечего.
            // Просто выходим из функции, не пробрасывая ошибку дальше.
            return;
        }
        // ❗ Если ошибка ДРУГАЯ (например, "message to edit not found" или сеть) — 
        // тогда пробрасываем её в глобальный catch для логирования
        throw error;
    }
}