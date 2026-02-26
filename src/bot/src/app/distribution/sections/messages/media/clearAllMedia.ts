import utils from "src/common/utils";
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import menuMedia from "@menus/distribution/sections/message/media";
import { ServerManager } from "@utils/ServerManager";

/**
 * Оповещение пользователя об удалении всех медиа
 */
export default async function clearAllMedia(ctx: MyContext) {    
    const queryData = "data" in ctx.callbackQuery! ? ctx.callbackQuery.data : null;
    const nameDistribution = ctx.session.distribution.name!;
    const positionIndex = Number(queryData!.split(/:/)[1]) || 0;
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
    const message = messages[positionIndex];
    let text = [];
    
    try {
        // 🔥 УДАЛЯЕМ ФАЙЛЫ ИЗ ФАЙЛОВОЙ СИСТЕМЫ
        for (const file of message?.media!) {
            if (file && file !== 'null' && typeof file === 'string') {
                try {
                    await utils.file.deleteFile(file);
                    console.log(`🗑️ Удалён файл: ${file}`);
                } catch (err) {
                    console.warn(`Файл не найден: ${file}`);
                }
            }
        }

        // 🔥 ОБНУЛЯЕМ МЕДИА В БД
        await db.message.updateMessage(nameDistribution, message?.id!, { media: null });

        const server = new ServerManager();
        if (await server.restartProcessOrNot(nameDistribution)) {
            text.push("distribution.sections.messages.media.clearAll.success");
        } 
        else {
            text.push("distribution.sections.messages.media.clearAll.error");
        }
    } catch (error) {
        console.error("Ошибка удаления медиа:", error);
        text.push("distribution.sections.messages.media.clearAll.error");
    }

    const menu = menuMedia.clearAll(ctx, text);
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