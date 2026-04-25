import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuContracts from "@menus/modules/commands/panel/contracts";
import { Composer } from "grammy";
import common from "@utils/common";

const contractComposer = new Composer<MyContext>();

/**
 * Главное меню раздела пользователи
 */
contractComposer.callbackQuery("mainContracts", async (ctx: MyContext) => {
    common.resetSessionStates(ctx.session);
    const menu = menuContracts.main(ctx, (await db.contract.getContracts())?.length!);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard
    });
});

/**
 * Отображение списка пользователей
 */
contractComposer.callbackQuery("viewContracts", async (ctx: MyContext) => {
    const menu = menuContracts.viewContracts(ctx, await db.contract.getContracts());
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });
});

// /**
//  * Отображение выбранного пользователя
//  */
// contractComposer.callbackQuery(/^viewUser#/, async (ctx: MyContext) => {
//     const userId = Number(ctx.callbackQuery?.data?.split('#')[1]!);
//     const menu = menuUsers.viewUser(ctx, (await db.user.getUser(userId))!);
//     await ctx.editMessageText(menu.text, {
//         parse_mode: "MarkdownV2",
//         reply_markup: menu.keyboard,
//     });
// });

// /**
//  * Создание пользователя
//  */
// contractComposer.callbackQuery("createUser", async (ctx: MyContext) => {
//     ctx.session.state.addingUser = true;
//     const menu = menuUsers.create(ctx);
//     const msg = await ctx.editMessageText(menu.text, {
//         parse_mode: "MarkdownV2",
//         reply_markup: menu.keyboard,
//     });

//     // Сохранение айди для последующего редактирования этого же сообщения
//     if (typeof msg !== "boolean" && "message_id" in msg) {
//         ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
//     }
// });

// /**
//  * Удаление пользователя
//  */
// contractComposer.callbackQuery(/^removeUser#/, async (ctx: MyContext) => {
//     const userId = Number(ctx.callbackQuery?.data?.split('#')[1]!);
//     const user = (await db.user.getUser(userId))!;
//     let menu;
//     if (await db.user.removeFromSystem(userId)) {
//         menu = menuUsers.remove(ctx, user, true);
//     }
//     else {
//         menu = menuUsers.remove(ctx, user, false);
//     }    

//     await ctx.editMessageText(menu.text, {
//         parse_mode: "MarkdownV2",
//         reply_markup: menu.keyboard,
//     });
// });

export default contractComposer;