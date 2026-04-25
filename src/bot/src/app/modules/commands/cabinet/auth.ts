import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import menuAuth from '@menus/modules/commands/cabinet/auth';

const authComposer = new Composer<MyContext>();

authComposer.callbackQuery("loginAuth", async (ctx: MyContext) => {
    await ctx.api.deleteMessage(ctx.chatId!, ctx.msgId!);
    
    const menu = menuAuth.sendLogin(ctx);
    const msg = await ctx.reply(menu.text, {
        reply_markup: menu.keyboard,
        parse_mode: 'MarkdownV2'
    });
    ctx.session.other.ids.commandCabinetId = msg?.message_id!;
    console.log("delete do: ", ctx.session.other.ids.commandCabinetId);
    
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

export default authComposer;