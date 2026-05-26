import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import menuAuth from '@menus/modules/commands/cabinet/auth';
import type { AuthLimit } from '@shared/types/DB';

const authComposer = new Composer<MyContext>();

authComposer.callbackQuery("loginAuth", async (ctx: MyContext) => {
    const infoAboutAuth = await db.auth_limit.get(BigInt(ctx.from?.id!));
    let menu;
    if (infoAboutAuth) { // если есть информация в базе авторизации
        ctx.session.authLimit = infoAboutAuth;
        if (infoAboutAuth.blocked_until) {
            if (infoAboutAuth.blocked_until.getTime() >= Date.now()) {
                menu = menuAuth.stop(ctx);
                await ctx.editMessageText(menu.text, {
                    reply_markup: menu.keyboard,
                    parse_mode: 'MarkdownV2'
                });
            }
            else {
                const authLimit: AuthLimit = {
                    telegram_id: BigInt(ctx.from?.id!),
                    failed_attempts: 0,
                    blocked_until: null,
                    last_attempt_at: new Date()
                };

                await db.auth_limit.update(authLimit);
                login(ctx); 
            }
        }
        // если 4 > кол-во неудач > 0
        else if (infoAboutAuth.failed_attempts! > 0 && infoAboutAuth.failed_attempts! < 4) {
            login(ctx, infoAboutAuth.failed_attempts!);
        }
    }
    else { // пользователя нет в базе авторизации
        await db.auth_limit.insert(BigInt(ctx.from?.id!));
        login(ctx); 
    }
});

authComposer.callbackQuery("logoutAuth", async (ctx: MyContext) => {
    try {
        const result = await db.user.removeFromSystem(BigInt(ctx.from?.id!));
        
        const menu = menuAuth.logout(ctx, result);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard ?? null,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error("Ошибка при выходе из системы", error);
    }
});

async function login(ctx: MyContext, attempts?: number) {
    const menu = attempts ? menuAuth.login(ctx, attempts) : menuAuth.login(ctx);
        
    ctx.session.state.passingAuthorization = true;
    await ctx.api.deleteMessage(ctx.chatId!, ctx.msgId!);
    
    const msg = await ctx.reply(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: 'MarkdownV2'
    });
    ctx.session.other.ids.cash.push(msg?.message_id!);
}

export default authComposer;