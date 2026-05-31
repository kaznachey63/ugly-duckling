import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import menuAuth from '@menus/modules/commands/auth/main';
import type { AuthLimit } from '@shared/types/DB';

const authComposer = new Composer<MyContext>();

authComposer.command('auth', async (ctx: MyContext) => {
    if (await db.user.exists(BigInt(ctx.from!.id!))) await ctx.reply(ctx.t("modules.commands.auth.login.already"));
    else checkLogin(ctx);
});

authComposer.callbackQuery("loginAuth", async (ctx: MyContext) => {
    checkLogin(ctx);
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

/**
 * Осуществление авторизации
 */
async function login(ctx: MyContext) {
    const menu = menuAuth.login(ctx);
        
    ctx.session.state.passingAuthorization = true;
    if (ctx.callbackQuery?.data) await ctx.api.deleteMessage(ctx.chatId!, ctx.msgId!);
    const msg = await ctx.reply(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: 'MarkdownV2'
    });
    ctx.session.other.ids.cash = [];
    ctx.session.other.ids.cash.push(msg?.message_id);
}

/**
 * Проверка: под какой пункт авторизации попадает
 */
async function checkLogin(ctx: MyContext) {
    const infoAboutAuth = await db.auth_limit.get(BigInt(ctx.from?.id!));
    let menu;
    if (infoAboutAuth) { // если есть информация в базе авторизации
        ctx.session.authLimit = infoAboutAuth;
        if (infoAboutAuth.blocked_until) {
            if (infoAboutAuth.blocked_until.getTime() >= Date.now()) {
                menu = menuAuth.stop(ctx);
                try {
                    await ctx.editMessageText(menu.text, {
                        reply_markup: menu.keyboard ?? null,
                        parse_mode: 'MarkdownV2'
                    });
                } catch {
                    await ctx.reply(menu.text, {
                        reply_markup: menu.keyboard ?? null,
                        parse_mode: 'MarkdownV2'
                    });
                }
            }
            else {
                const authLimit: AuthLimit = {
                    telegram_id: BigInt(ctx.from?.id!),
                    failed_attempts: 0,
                    blocked_until: null,
                    last_attempt_at: new Date()
                };
                ctx.session.authLimit = authLimit;
                await db.auth_limit.update(authLimit);
                login(ctx); 
            }
        }
        // если кол-во неудач > 0
        else if (infoAboutAuth.failed_attempts! > 0) login(ctx);        
        else login(ctx); 
    }
    else { // пользователя нет в базе авторизации
        await db.auth_limit.insert(BigInt(ctx.from?.id!));
        ctx.session.authLimit = (await db.auth_limit.get(BigInt(ctx.from?.id!)))!;
        login(ctx); 
    }
}
export default authComposer;