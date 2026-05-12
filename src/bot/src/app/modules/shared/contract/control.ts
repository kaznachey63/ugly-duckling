import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuControl from "@menus/modules/shared/contract/control";
import { Composer } from "grammy";

const controlComposer = new Composer<MyContext>();

/**
 * Удаление договора
 */
controlComposer.callbackQuery(/^removeContract#/, async (ctx: MyContext) => {
    const contractId = Number(ctx.callbackQuery?.data?.split('#')[1]!);
    ctx.session.contract = (await db.contract.getById(contractId))!;
    const result = await db.contract.removeById(contractId);
    const menu  = menuControl.remove(ctx, result);    

    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });
});

/**
 * Создание договора
 */
controlComposer.callbackQuery("createContract", async (ctx: MyContext) => {
    ctx.session.state.addingContract = true;
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

export default controlComposer;