import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuContracts from "@menus/modules/shared/contract/main";
import { Composer } from "grammy";
import common from "@utils/common";
import exportComposer from "./export";
import controlComposer from "./control";
import viewComposer from "./view";

const contractComposer = new Composer<MyContext>();

/**
 * Главное меню раздела договоры
 */
contractComposer.callbackQuery("mainContract", async (ctx: MyContext) => {
    common.resetSessionStates(ctx.session);
    const menu = menuContracts.main(ctx, (await db.contract.getContracts())?.length!);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard
    });
});

contractComposer.use(controlComposer);
contractComposer.use(exportComposer)
contractComposer.use(viewComposer)

export default contractComposer;