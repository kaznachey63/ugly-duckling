import utils from "src/common/utils";
import type { MyContext } from '@shared/types/SessionData';
import menuMain from "@menus/commands/cabinet/distribution/main";

/**
 * Отображение меню рассылки (разделы рассылки)
 */
export default async function mainDistribution(ctx: MyContext) {
    const menu = await menuMain(ctx);
    await ctx.editMessageText(utils.formatting.escapeMarkdown(menu.text),
    {
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
}