import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuControl from "@menus/modules/commands/panel/data/user/control";
import { Composer } from "grammy";

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

export default controlComposer;