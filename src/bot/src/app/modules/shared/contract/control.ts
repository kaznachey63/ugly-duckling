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
 * 1 шаг создания договора. Отображение пользователей
 */
controlComposer.callbackQuery("chooseUsers", async (ctx: MyContext) => {
    const users = (await db.user.gets()).filter(u => u.role_id != 1);
    const menu = menuControl.chooseUsers(ctx, users);

    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });
});

/**
 * 1.5 шаг создания договора. Сохранение выбранного пользователя
 */
controlComposer.callbackQuery(/^pickUser#/, async (ctx: MyContext) => {
    const userId = Number(ctx.callbackQuery?.data?.split('#')[1])!;
    // Повторное нажатие по уже выбранному заказчику снимает выбор (галка слетает)
    const isDeselect = userId == ctx.session.contract.user_id;

    if (!isDeselect) {
        if (!(await db.user.get(userId))?.telegram_id) { // заказчик существует, но не атворизован
            return ctx.answerCallbackQuery({ text: ctx.t("modules.shared.contract.create.customerNotAuthorized"), show_alert: true });
        }
        else if (!(await db.sendout.getSendoutsOfUserIdAndNotInContract(userId)).length) { // заказчик существует (по идее авторизован), но нет (свободных) рассылок привязанных к нему
            return ctx.answerCallbackQuery({ text: ctx.t("modules.shared.contract.create.noFreeSendouts"), show_alert: true });
        }
    }

    // При смене заказчика ранее выбранные рассылки принадлежат другому заказчику — сбрасываем
    ctx.session.contract.sendout = [];
    ctx.session.contract.user_id = isDeselect ? 0 : userId;

    const users = (await db.user.gets()).filter(u => u.role_id != 1);
    const menu = menuControl.chooseUsers(ctx, users);

    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });
});

/**
 * 2 шаг создания договора. Отображение рассылок
 */
controlComposer.callbackQuery("chooseSendouts", async (ctx: MyContext) => {
    if (ctx.session.contract.user_id! <= 0) {
        return ctx.answerCallbackQuery({ text: ctx.t("modules.shared.contract.create.noUser"), show_alert: true });
    }

    const sendouts = await db.sendout.getSendoutsOfUserIdAndNotInContract(ctx.session.contract.user_id!);
    const menu = menuControl.chooseSendouts(ctx, sendouts);
    
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });
});

/**
 * 2.5 шаг создания договора. Сохранение выбранной рассылки
 */
controlComposer.callbackQuery(/^pickSendout#/, async (ctx: MyContext) => {
    const sendoutId = Number(ctx.callbackQuery?.data?.split('#')[1]);
    ctx.session.contract.sendout ??= [];
    const exists = ctx.session.contract.sendout.some(s => s.id === sendoutId);

    if (exists) {
        ctx.session.contract.sendout = ctx.session.contract.sendout.filter(s => s.id !== sendoutId);
    } 
    else {
        ctx.session.contract.sendout.push({
            id: sendoutId
        });
    }
    const sendouts = await db.sendout.getSendoutsOfUserIdAndNotInContract(ctx.session.contract.user_id!);
    const menu = menuControl.chooseSendouts(ctx, sendouts);
    
    await ctx.editMessageText(menu.text, {
        parse_mode: "MarkdownV2",
        reply_markup: menu.keyboard,
    });
});

/**
 * 3 шаг создания договора. Ожидание ввода данных договора (даты)
 */
controlComposer.callbackQuery("inputContractData", async (ctx: MyContext) => {
    if (!ctx.session.contract.sendout?.length! || ctx.session.contract.sendout?.length! <= 0) {
        return ctx.answerCallbackQuery({ text: ctx.t("modules.shared.contract.create.noSendouts"), show_alert: true });
    }
    
    ctx.session.state.addingContract = true;
    const menu = menuControl.inputData(ctx);
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