import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import menuContact from "@menus/handlers/events/contact";
import menuAuth from '@menus/modules/cabinet/profile/auth';
import common from '@utils/common';

const contactComposer = new Composer<MyContext>();

contactComposer.on('message:contact', async (ctx: MyContext) => {
    try {
        const phoneNumber = ctx.message!.contact?.phone_number?.replace('+', '');
        if (!phoneNumber) return;
    
        // 1. Сначала отправляем "Обработка..." и ПОЛУЧАЕМ ID этого сообщения
        const processingMsg = await ctx.reply(ctx.t("utils.shared.processing"), {
            reply_markup: { remove_keyboard: true }
        });
        
        const processingMsgId = processingMsg?.message_id;

        if (await db.user.matchPhoneNumber(phoneNumber) || common.isAdmin(ctx.session.user.role)) {
            ctx.session.user.phone = phoneNumber;
            
            // 3. Удаляем, передавая ID сообщения обработки
            await deleteMessageProcessing(ctx, processingMsgId);

            let menu;
            try {
                if (common.isAdmin(ctx.session.user.role)) await db.user.insertToDB(ctx) 
                else await db.user.updateData(ctx);

                menu = menuAuth.processLogin(ctx, true);
                await ctx.reply(menu.text, { 
                    reply_markup: menu.keyboard, 
                    parse_mode: "MarkdownV2" 
                });             
            } catch {
                menu = menuAuth.processLogin(ctx, false);
                await ctx.reply(menu.text, { 
                    reply_markup: menu.keyboard, 
                    parse_mode: "MarkdownV2" 
                });  
            }
        }
        else {
            // 4. Если доступ запрещен — тоже удаляем
            await deleteMessageProcessing(ctx, processingMsgId);
            const menu = menuContact(ctx);
            await ctx.reply(menu.text, {
                reply_markup: menu.keyboard,
                parse_mode: 'MarkdownV2'
            });
        }
    } catch (error) {
        console.error("Ошибка в обработке контакта:", error);
    }
});

async function deleteMessageProcessing(ctx: MyContext, endMsgId?: number) {
    try {
        const commandId = ctx.session.other.ids.commandCabinetId;
        const targetEndId = endMsgId || ctx.msgId;
        
        // Проверки: если нет данных — выходим
        if (!commandId || !targetEndId || !ctx.chat?.id) return;

        let count = 0;
        const maxIterations = 100;

        while (commandId <= targetEndId - count) {
            if (count > maxIterations) break;

            const targetId = targetEndId - count;
            if (!targetId) break;

            try {
                await ctx.api.deleteMessage(ctx.chat.id, targetId);
            } catch { }

            count += 1;
        }
    } catch { }
}

export default contactComposer;