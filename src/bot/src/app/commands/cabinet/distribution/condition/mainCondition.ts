import type { MyContext } from '@shared/types/SessionData';
import menuCondition from "@menus/commands/cabinet/distribution/condition";
import { ServerManager } from "@utils/ServerManager";
import type { Status } from '@shared/types/server/Status';

export default async function mainCondition(ctx: MyContext) {
    const server = new ServerManager();
    const menu = menuCondition(ctx, await server.getServiceStatus(ctx.session.distribution.name, true) as Status);
    await ctx.editMessageText(menu.text,
        {
            parse_mode: "MarkdownV2",
            reply_markup: menu.keyboard
        }
    );
}