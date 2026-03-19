import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuChat from "@menus/modules/panel/chats";
import { ServerManager } from "@utils/ServerManager";
import { Composer } from "grammy";
import { sleep } from "telegram/Helpers";

const chatsComposer = new Composer<MyContext>();

/**
 * Главная страница раздела чаты
 */
chatsComposer.callbackQuery("mainChats", async (ctx: MyContext) => {
    const menu = menuChat.main(ctx, (await db.chat.getChats())?.length!);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard
    });
});

/**
 * Обработка очистки чатов
 */
chatsComposer.callbackQuery("clearChats", async (ctx: MyContext) => {
    await ctx.editMessageText(ctx.t("utils.shared.processing"));
    await db.chat.clearTableChats();
    
    const menu = menuChat.clear(ctx, (await db.chat.getChats())?.length!);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard
    });
});

/**
 * Обработка переформирования чатов
 */
chatsComposer.callbackQuery("reuploadChats", async (ctx: MyContext) => {
    await ctx.editMessageText(ctx.t("utils.shared.processing"));

    const server = new ServerManager();
    const nameService = "hawk-parser";

    await server.startService(nameService);

    const maxWait = 1000 * 60 * 2;
    const interval = 10000;
    const start = Date.now();
    let success = false; 

    while (Date.now() - start < maxWait) {
        sleep(interval);
        if (!await server.isServiceActive(nameService)) {
            const exitCode = await server.getServiceExitCode(nameService);
            success = exitCode === 0; // true только если код 0
            break;
        }
    }

    const menu = menuChat.reupload(ctx, success);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });
});

export default chatsComposer;