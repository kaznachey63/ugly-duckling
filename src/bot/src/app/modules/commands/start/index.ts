import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuStart from '@menus/modules/commands/start/main';
const startComposer = new Composer<MyContext>();

// Команда /start
startComposer.command('start', async (ctx: MyContext) => {
    try {
        const menu = menuStart(ctx);
        // await ctx.reply(menu.text, {
        //     reply_markup: menu.keyboard,
        //     parse_mode: "MarkdownV2"
        // });
await ctx.replyWithRichMessage(
    {
        markdown: 
        `# Heading 1
        ## Heading 2
        ### Heading 3
        #### Heading 4
        ##### Heading 5
        ###### Heading 6
        `,
    }
);


    } catch (error) {
        console.error("Ошибка в команде start:", error);
    }
});

export default startComposer;