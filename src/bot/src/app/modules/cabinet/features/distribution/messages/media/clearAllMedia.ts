import fileImport from "@utils/file";
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import menuMedia from "@menus/commands/cabinet/distribution/message/media";
import { ServerManager } from "@utils/ServerManager";

/**
 * Оповещение пользователя об удалении всех медиа
 */
export default async function clearAllMedia(ctx: MyContext) {    
    const queryData = ctx.callbackQuery?.data;
    const nameDistribution = ctx.session.distribution.name!;
    const positionIndex = Number(queryData!.split(/:/)[1]) || 0;
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
    const message = messages[positionIndex];
    const server = new ServerManager();

    // 🔥 УДАЛЯЕМ ФАЙЛЫ ИЗ ФАЙЛОВОЙ СИСТЕМЫ
    for (const file of message?.media!) {
        if (file && file !== 'null' && typeof file === 'string') {
            try {
                await fileImport.deleteFile(file);
                console.log(`🗑️ Удалён файл: ${file}`);
            } catch (err) {
                console.warn(`Файл не найден: ${file}`);
            }
        }
    }
    
    // 🔥 ОБНУЛЯЕМ МЕДИА В БД
    await db.message.updateMessage(nameDistribution, message?.id!, { media: null });
    
    const menu = menuMedia.clearAll(ctx, await server.restartProcessOrNot(nameDistribution));
    await ctx.editMessageText(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
};