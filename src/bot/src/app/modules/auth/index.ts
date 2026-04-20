import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import menuAuth from '@menus/modules/auth/main';

const authComposer = new Composer<MyContext>();

// Команда /auth
authComposer.command('auth', async (ctx: MyContext) => {
    try {
        // Присваивание айди сообщения команды /auth чтобы удалить мусор
        if (ctx.message?.text?.startsWith('/')) ctx.session.other.ids.commandCabinetId = ctx.msgId!;

        const userExistsInDB = await db.user.existsInDB(ctx.from?.id!);
        const menu = menuAuth(ctx, userExistsInDB);

        await ctx.reply(menu.text, {
            reply_markup: menu.keyboard ?? null,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error("Ошибка в команде auth:", error);
    }
});

export default authComposer;