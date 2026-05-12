import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuContract from "@menus/modules/shared/contract/main";
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
    clearContract(ctx);
    const menu = menuContract(ctx, (await db.contract.getContracts())?.length!);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard
    });
});

function clearContract(ctx: MyContext) {
    ctx.session.contract = {
        date_end: new Date(),
        date_start: new Date(),
        price: 0,
        price_text: "",
        id: 0,
        user_id: 0,
        user: {
            telegram_id: BigInt(0),
            language: 'ru',
            name: "",
            phone: "",
            username: "",
            role: {
                id: 0,
                code: "unknown"
            },
            id: 0,
            role_id: 0
        }
    }
}

contractComposer.use(controlComposer);
contractComposer.use(exportComposer)
contractComposer.use(viewComposer)

export default contractComposer;