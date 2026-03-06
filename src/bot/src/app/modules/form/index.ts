import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuForm from "@menus/commands/form";

const formComposer = new Composer<MyContext>();

// Команда /form
formComposer.command('form', async (ctx: MyContext) => {
    try {
        const menu = menuForm(ctx);
        await ctx.reply(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error("Ошибка в команде form:", error);
    }
});

export default formComposer;