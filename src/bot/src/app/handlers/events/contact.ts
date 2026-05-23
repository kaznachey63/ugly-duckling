import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import menuContact from "@menus/handlers/events/contact";
import menuAuth from '@menus/modules/commands/cabinet/auth';
import type { User } from '@shared/types/DB';
import localization from '@utils/localization';
import common from '@utils/common';
import { CryptoService } from '@common/services/CryptoService';

const contactComposer = new Composer<MyContext>();

contactComposer.on('message:contact', async (ctx: MyContext) => {
    if (!ctx.session.state.passingAuthorization) {
        await ctx.deleteMessage();
        const msg = await ctx.reply('.', { reply_markup: { remove_keyboard: true } });
        try { await ctx.api.deleteMessage(ctx.chatId!, msg.message_id); } catch {};
        return;
    }
    
    try {
        ctx.session.other.ids.cash.push(ctx.message?.message_id!);
        const phoneNumber = ctx.message!.contact?.phone_number?.replace('+', '');
    
        // 1. Сначала отправляем "Обработка..." и ПОЛУЧАЕМ ID этого сообщения
        const processingMsg = await ctx.reply(ctx.t("utils.shared.processing"), {
            reply_markup: { remove_keyboard: true }
        });
        ctx.session.other.ids.cash.push(processingMsg?.message_id);
        
        if (!phoneNumber) {
            await common.deleteCashMessages(ctx);
            await ctx.reply("Ошибка при прохождении авторизации. Номер телефона окзался пустым");
            return;
        }

        const isAdminPhone = common.isAdminPhone(phoneNumber);

        const phoneNumberHashed = CryptoService.encrypt(phoneNumber);
        const matchNumberCustomer = await db.user.matchPhoneNumber(phoneNumberHashed);

        if (await db.user.exists(BigInt(ctx!.from!.id!))) {
            await ctx.reply(ctx.t("modules.commands.cabinet.auth.login.already"), { 
                parse_mode: "MarkdownV2" 
            });  
        }
        else if (matchNumberCustomer || isAdminPhone) { 
            ctx.session.user.phone = phoneNumber;
            
            // 3. Удаляем, передавая ID сообщения обработки
            await common.deleteCashMessages(ctx);

            let menu;
            try {
                const user = formatUser(ctx);
                if (isAdminPhone) await db.user.insert(user); // по сути проверка чисто на меня
                else await db.user.updateUser(user); // проверка на остальных

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
            await common.deleteCashMessages(ctx);

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

function formatUser(ctx: MyContext): User {
    const firstName = ctx.from?.first_name!;
    const lastName = ctx.from?.last_name!;
    const phone = CryptoService.encrypt(ctx.session?.user?.phone!);
    const roleId = common.isAdminPhone(ctx.session.user.phone!) ? 1 : 2;

    return {
        telegram_id: BigInt(ctx.from?.id!),
        username: ctx.from?.username!,
        name: lastName ? `${firstName} ${lastName}` : firstName,
        phone: phone,
        language: ctx.session.user.language!,
        role: {
            id: roleId,
            code: localization.getRoleType(roleId)
        }
    };
}

export default contactComposer;