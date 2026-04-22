import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import menuAuth from '@menus/modules/auth/main';

const authComposer = new Composer<MyContext>();

authComposer.callbackQuery("loginAuth", async (ctx: MyContext) => {
    if (ctx.message?.text?.startsWith('/')) ctx.session.other.ids.commandCabinetId = ctx.msgId!;
    await ctx.api.deleteMessage(ctx.chatId!, ctx.msgId!);

    const menu = menuAuth.login(ctx);
    await ctx.reply(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: 'MarkdownV2'
    });
});

authComposer.callbackQuery("logoutAuth", async (ctx: MyContext) => {
    try {
        const result = await db.user.removeFromSystem(ctx.from?.id!);
        
        const menu = menuAuth.logout(ctx, result);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard ?? null,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error("Ошибка при выходе из системы", error);
    }
});

// Команда /auth
// authComposer.command('auth', async (ctx: MyContext) => {
//     try {
//         // Присваивание айди сообщения команды /auth чтобы удалить мусор
//         if (ctx.message?.text?.startsWith('/')) ctx.session.other.ids.commandCabinetId = ctx.msgId!;

//         const userExistsInDB = await db.user.existsInDB(ctx.from?.id!);
//         const menu = menuAuth(ctx, userExistsInDB);

//         await ctx.reply(menu.text, {
//             reply_markup: menu.keyboard ?? null,
//             parse_mode: 'MarkdownV2'
//         });
//     } catch (error) {
//         console.error("Ошибка в команде auth:", error);
//     }
// });

export default authComposer;