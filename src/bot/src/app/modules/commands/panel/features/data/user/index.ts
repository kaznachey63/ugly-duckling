import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuUser from "@menus/modules/commands/panel/data/user/main";
import { Composer } from "grammy";
import common from "@utils/common";
import controlComposer from "./control";
import viewComposer from "./view";

const userComposer = new Composer<MyContext>();

/**
 * Главное меню раздела пользователи
 */
userComposer.callbackQuery("mainUser", async (ctx: MyContext) => {
    common.resetSessionStates(ctx.session);
    const menu = menuUser(ctx, (await db.user.gets())?.length!);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard
    });
});

userComposer.use(controlComposer);
userComposer.use(viewComposer);

export default userComposer;