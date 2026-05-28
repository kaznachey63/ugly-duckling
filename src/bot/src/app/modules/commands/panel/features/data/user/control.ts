import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuControl from "@menus/modules/commands/panel/data/user/control";
import { Composer } from "grammy";
import menuView from "@menus/modules/commands/panel/data/user/view";

const controlComposer = new Composer<MyContext>();

/**
 * Создание пользователя
 */
controlComposer.callbackQuery("createUser", async (ctx: MyContext) => {
    ctx.session.state.addingUser = true;
    const menu = menuControl.create(ctx);
    const msg = await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });

    // Сохранение айди для последующего редактирования этого же сообщения
    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
    }
});

/**
 * Удаление пользователя
 */
controlComposer.callbackQuery(/^removeUser#/, async (ctx: MyContext) => {
    const userId = Number(ctx.callbackQuery?.data?.split('#')[1]!);
    const user = (await db.user.get(userId))!;
    const result = await db.user.removeFromSystem(userId);
    const menu = menuControl.remove(ctx, user, result);
    
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });
});

/**
 * Редактирование роли пользователя
 */
controlComposer.callbackQuery(/^updateOrRemoveUserRole#/, async (ctx: MyContext) => {
    const userId = Number(ctx.callbackQuery?.data?.split('#')[1]!);
    const user = (await db.user.get(userId))!;
    
    switch (user.role_id!) {
        case 1: user.role_id = 2; break;
        case 2: user.role_id = 3; break;
        case 3: user.role_id = 1; break;
    }
    
    await db.user.updateRole(userId, user.role_id!);

    const menu = menuView.viewUser(ctx, user);
    await ctx.editMessageReplyMarkup({ reply_markup: menu.keyboard });
});

export default controlComposer;