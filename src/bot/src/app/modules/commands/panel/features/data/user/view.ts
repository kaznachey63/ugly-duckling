import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuView from "@menus/modules/commands/panel/data/user/view";
import menuUser from "@menus/modules/commands/panel/data/user/main";
import { Composer } from "grammy";

const viewComposer = new Composer<MyContext>();

/**
 * Отображение списка пользователей
 */
viewComposer.callbackQuery("viewUsers", async (ctx: MyContext) => {
    let menu;
    const users = await db.user.gets();
    
    if (users.length <= 0) menu = menuUser(ctx, 0);
    else menu = menuView.viewUsers(ctx, users);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });
});

/**
 * Отображение выбранного пользователя
 */
viewComposer.callbackQuery(/^viewUser#/, async (ctx: MyContext) => {
    const userId = Number(ctx.callbackQuery?.data?.split('#')[1]!);
    const menu = menuView.viewUser(ctx, (await db.user.get(userId))!);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });
});

export default viewComposer;