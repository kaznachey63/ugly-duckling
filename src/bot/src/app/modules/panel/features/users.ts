import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuUsers from "@menus/modules/panel/users";
import { Composer } from "grammy";

const usersComposer = new Composer<MyContext>();

/**
 * Главное меню раздела пользователи
 */
usersComposer.callbackQuery("mainUsers", async (ctx: MyContext) => {
    const menu = menuUsers.main(ctx, (await db.user.getUsers())?.length!);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard
    });
});

/**
 * Отображение списка пользователей
 */
usersComposer.callbackQuery("viewUsers", async (ctx: MyContext) => {
    const menu = menuUsers.viewUsers(ctx, await db.user.getUsers());
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });
});

/**
 * Отображение выбранного пользователя
 */
usersComposer.callbackQuery(/^viewUser#/, async (ctx: MyContext) => {
    const userId = Number(ctx.callbackQuery?.data?.split('#')[1]);
    const menu = menuUsers.viewUser(ctx, (await db.user.getUser(userId, true))!);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });
});

/**
 * Создание пользователя
 */
usersComposer.callbackQuery("createUser", async (ctx: MyContext) => {
    ctx.session.state.addingUser = true;
    const menu = menuUsers.create(ctx);
    const msg = await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });

    // Сохранение айди для последующего редактирования этого же сообщения
    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
    }
});

export default usersComposer;