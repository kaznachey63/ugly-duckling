import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';

const startComposer = new Composer<MyContext>();

// Команда /start
startComposer.command('start', async (ctx: MyContext) => {
    try {
        await ctx.reply(ctx.t("modules.commands.start.title"));
    } catch (error) {
        console.error("Ошибка в команде start:", error);
    }
});

export default startComposer;