import type { MyContext } from '@shared/types/SessionData';
import menuCondition from "@menus/distribution/sections/condition";
import { ServerManager } from "@utils/ServerManager";
import type { Status } from '@shared/types/server/Status';

export default async function mainCondition(ctx: MyContext) {
    const server = new ServerManager();
    const menu = menuCondition(ctx, await server.execute("status", ctx.session.distribution.name) as Status);
    await ctx.editMessageText(menu.text,
        {
            parse_mode: "MarkdownV2",
            reply_markup: menu.keyboard
        }
    );
}