import { ServerManager } from "@utils/ServerManager";
import type { MyContext } from '@shared/types/SessionData';
import type { Status } from "@shared/types/server/Status";
import menuCondition from "@menus/commands/cabinet/distribution/condition";
import common from '@utils/common';

export default async function stopDistribution(ctx: MyContext) {
    await ctx.editMessageText(ctx.t("utils.shared.processing"));
    const server = new ServerManager();
    await server.stopService(ctx.session.distribution.name, true);
    common.sleep(250);
    const menu = menuCondition(ctx, await server.getServiceStatus(ctx.session.distribution.name, true) as Status);

    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard
    });
}