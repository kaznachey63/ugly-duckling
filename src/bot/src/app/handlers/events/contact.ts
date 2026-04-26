import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import menuContact from "@menus/handlers/events/contact";
import menuAuth from '@menus/modules/commands/cabinet/auth';
import type { User } from '@shared/types/User';
import localization from '@utils/localization';

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
        if (await db.user.existsInDB(BigInt(ctx!.from!.id!))) {
            await ctx.reply(ctx.t("modules.commands.cabinet.auth.login.already"), { 
                parse_mode: "MarkdownV2" 
            });  
        }
        else if (await db.user.matchPhoneNumber(phoneNumber) || ctx.session.isAdmin) { // возожн лишняя проверка на админа
            ctx.session.user.phone = phoneNumber;
            
            // 3. Удаляем, передавая ID сообщения обработки
            await deleteMessageProcessing(ctx, processingMsgId);

            let menu;
            try {
                const user = formatUser(ctx);
                if (ctx.session.isAdmin) await db.user.insertToDB(user); // по сути проверка чисто на меня
                else await db.user.updateData(user); // проверка на остальных

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

function formatUser(ctx: MyContext): User {
    const firstName = ctx.from?.first_name!;
    const lastName = ctx.from?.last_name!;
    const phone = ctx.session?.user?.phone!;
    const roleId = phone == "79371807522" ? 1 : 2;

    return {
        telegramId: BigInt(ctx.from?.id!),
        username: ctx.from?.username!,
        name: lastName ? `${firstName} ${lastName}` : firstName,
        phone: phone,
        language: ctx.session.user.language,
        role: {
            id: roleId,
            code: localization.getRoleType(roleId)
        }
    };
}
export default contactComposer;