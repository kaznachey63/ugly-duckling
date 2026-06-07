import db from '@shared/db';
import type { MyContext } from '@shared/types/SessionData';
import menuControl from "@menus/modules/commands/panel/data/chat/control";
import { ServerManager } from "src/common/services/ServerManager"
import { Composer } from "grammy";
import { sleep } from "telegram/Helpers";

const controlComposer = new Composer<MyContext>();

/**
 * Обработка очистки чатов
 */
controlComposer.callbackQuery("clearChats", async (ctx: MyContext) => {
    await ctx.editMessageText(ctx.t("utils.shared.processing"));
    await db.chat.clear();
    
    const menu = menuControl.clear(ctx, (await db.chat.get())?.length!);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard
    });
});

/**
 * Обработка переформирования чатов
 */
controlComposer.callbackQuery("reuploadChats", async (ctx: MyContext) => {
    await ctx.editMessageText(ctx.t("utils.shared.processing"));

    const processName = "uglyduckling-parser.service";

    await ServerManager.startProcess(processName);

    const maxWait = 1000 * 60 * 2;
    const interval = 10000;
    const start = Date.now();
    let success = false; 

    while (Date.now() - start < maxWait) {
        sleep(interval);
        if (!await ServerManager.isProcessActive(processName)) {
            const exitCode = await ServerManager.getProcessExitCode(processName);
            success = exitCode === 0; // true только если код 0
            break;
        }
    }

    const menu = menuControl.reupload(ctx, success);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });
});

export default controlComposer;