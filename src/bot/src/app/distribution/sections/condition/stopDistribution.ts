import { ServerManager } from "@utils/ServerManager";
import type { MyContext } from '@shared/types/SessionData';
import type { Status } from "@shared/types/server/Status";
import menuCondition from "@menus/distribution/sections/condition";

export default async function stopDistribution(ctx: MyContext) {
    await ctx.editMessageText(ctx.t("nav.processing"));
    const server = new ServerManager();
    await server.execute("stop", ctx.session.distribution.name);
    new Promise(resolve => setTimeout(resolve, 250));
    const menu = menuCondition(ctx, await server.execute("status", ctx.session.distribution.name) as Status);

    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard
    });
}