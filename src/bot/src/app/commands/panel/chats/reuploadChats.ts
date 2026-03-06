import type { MyContext } from '@shared/types/SessionData';
import menuChat from "@menus/commands/panel/chats";
import { ServerManager } from "@utils/ServerManager";
import utils from "@utils";

/**
 * Обработка переформирования чатов
 */
export default async function reuploadChats(ctx: MyContext) {
    await ctx.editMessageText(ctx.t("utils.shared.processing"));

    const server = new ServerManager();
    const nameService = "uglyduckling-parser";

    await server.startService(nameService);

    const maxWait = 1000 * 60 * 2;
    const interval = 10000;
    const start = Date.now();
    let success = false; 

    while (Date.now() - start < maxWait) {
        await utils.common.sleep(interval);
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
}