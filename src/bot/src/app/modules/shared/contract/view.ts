import db from "@shared/db";
import type { MyContext } from '@shared/types/SessionData';
import menuView from "@menus/modules/shared/contract/view";
import { Composer } from "grammy";

const viewComposer = new Composer<MyContext>();

/**
 * Отображение списка договоров
 */
viewComposer.callbackQuery("viewContracts", async (ctx: MyContext) => {
    const contracts = ctx.session.isAdmin ? await db.contract.getContracts() : await db.contract.getContractsByUserId(BigInt(ctx?.from!.id));
    const menu = menuView.contracts(ctx, contracts);
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });
});

/**
 * Отображение договора за конкретным пользователем
 */
viewComposer.callbackQuery(/^viewContract#/, async (ctx: MyContext) => {
    ctx.session.contract = (await db.contract.getById(Number(ctx.callbackQuery?.data?.split('#')[1]!)))!;
    const sendoutsCall = await db.contract.getSendoutsByContractId(ctx.session.contract.id!);
    const menu = menuView.contract(ctx, sendoutsCall);

    try {
        const msg = await ctx.editMessageText(menu.text, {
            parse_mode: "MarkdownV2",
            reply_markup: menu.keyboard,
        });

        // Сохранение айди для последующего редактирования этого же сообщения
        if (typeof msg !== "boolean" && "message_id" in msg) {
            ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
        }
    } catch {
        await ctx.api.deleteMessage(ctx.chatId!, ctx.session.other.ids.idForUpdateMessageFromState);
        const msg = await ctx.reply(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });

        // Сохранение айди для последующего редактирования этого же сообщения
        if (typeof msg !== "boolean" && "message_id" in msg) {
            ctx.session.other.ids.idForUpdateMessageFromState = msg.message_id;
        }
    }
});

export default viewComposer;