import { ServerManager } from "@utils/ServerManager";
import type { MyContext } from '@shared/types/SessionData';
import type { Status } from "@shared/types/server/Status";
import menuCondition from "@menus/commands/cabinet/distribution/condition";
import common from '@utils/common';

export default async function startDistribution(ctx: MyContext) {
    await ctx.editMessageText(ctx.t("nav.processing"));
    const server = new ServerManager();
    await server.execute("start", ctx.session.distribution.name);
    common.sleep(250);
    const menu = menuCondition(ctx, await server.execute("status", ctx.session.distribution.name) as Status);

    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard
    });
}