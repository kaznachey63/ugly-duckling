import db from '@shared/db';
import type { MyContext } from '@shared/types/SessionData';
import menuControl from "@menus/modules/commands/panel/data/chat/control";
import { ServerManager } from "@common/services/ServerManager"
import { Composer } from "grammy";
import { sleep } from "telegram/Helpers.js";

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

    const processName = "ugly-duckling-parser.service";
    let success = false;
    try {
        const code = await ServerManager.startProcessAndWait(processName);
        const chats = await db.chat.get();
        success = code === 0 && chats!.length > 0;
    } catch (e) {
        console.error("reuploadChats:", e);
    }

    const menu = menuControl.reupload(ctx, success);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });
});

export default controlComposer;