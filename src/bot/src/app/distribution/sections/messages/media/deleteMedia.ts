import utils from "src/common/utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';
import db from '@shared/db';

export default async function deleteMedia(ctx: MyContext) {    
    const queryData = "data" in ctx.callbackQuery! ? ctx.callbackQuery.data : null;
    const nameDistribution = ctx.session.distribution.name!;
    const positionIndex = Number(queryData!.split(/:/)[1]) || 0;
    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
    const message = messages[positionIndex];
    
    if (messages && messages[positionIndex] && messages[positionIndex]?.media?.length === 0) {
        await ctx.answerCbQuery(`Медиа у -${ctx.session.distribution.call}- нет!`, { show_alert: true });
        return;
    } 
    
    let textMessage: string = "";
    
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

        if (await utils.server.reloadService(nameDistribution)) {
            textMessage = "✅ Медиа удалено!";
        } else {
            textMessage = "❌ Медиа не удалено!\nОбратитесь к администратору";
        }
    } catch (error) {
        console.error("Ошибка удаления медиа:", error);
        textMessage = "❌ Критическая ошибка удаления медиа!";
    }

    const menuDeleteMedia = Markup.inlineKeyboard(
        [Markup.button.callback("🔙 Назад", "mainMessage" + nameDistribution)]
    );

    try {
        await ctx.telegram.editMessageText(
            ctx?.chat?.id, // chat_id
            ctx.session.messageIds.forTextOrMedia, // message_id
            undefined, // inline_message_id
            utils.formatting.escapeMarkdown(textMessage += `\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → Сообщения → *Удаление медиа*]`),
            { parse_mode: "MarkdownV2", reply_markup: menuDeleteMedia.reply_markup }
        );
    } catch (error) {
        await ctx.reply(utils.formatting.escapeMarkdown(textMessage), menuDeleteMedia);
    }
};