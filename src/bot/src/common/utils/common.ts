import type { MyContext, SessionData } from '@shared/types/SessionData';
import db from '@shared/db';
import constants from '@constants';

/**
 * Сброс сессии
 */
function resetSessionStates(session: SessionData) {
    session.state.addingText = false;
    session.state.updatingText = false;
    session.state.generatingText = false;
    session.state.addingTime = false;
    session.state.updatingTime = false;
    session.state.addingMedia = false;
    session.state.addingIdea = false;
    session.state.addingUser = false;
    session.state.passingAuthorization = false;
    session.state.addingContract = false;
    session.state.updatingSendoutCall = false;
}

/**
 * Уставнока важных значений в сессию
 */
async function setPrimaryValuesSession(ctx: MyContext) {
    // Присваивание инфо о рассылке и пользователе
    if (await db.user.exists(BigInt(ctx.from?.id!))) {
        ctx.session.user = ctx.session.user.phone ? (await db.user.get(ctx.session.user.phone))! : (await db.user.get(BigInt(ctx.from?.id!)))!;
    }
    else {
        // @ts-ignore
        ctx.session.user.role.code = 'unknown';
    }
    // @ts-ignore
    ctx.session.isAdmin = ctx.session.user?.role.code === "admin";

    const sendoutId = Number(ctx?.callbackQuery?.data?.split(/:/)[1]?.split(/#/)[0]!);
    const infoDist = await db.sendout.getSendoutInfo(sendoutId);
    if (infoDist) ctx.session.sendout = infoDist;
}

/**
 * Проверка на тех. режим
 */
async function checkMaintenace(ctx: MyContext): Promise<boolean> {
    if (await db.general.maintenace() && !ctx.session.isAdmin) {
        if (ctx && ctx.callbackQuery?.data) {
            try {
                await ctx.editMessageText(ctx.t("utils.maintenace"));
            } catch (error) {
                await ctx.reply(ctx.t("utils.maintenace"));
            }
        }
        else await ctx.reply(ctx.t("utils.maintenace"));
        return true
    }
    return false
}

async function checkCancelButton(ctx: MyContext) {
    if (ctx.message?.text === "❌ Отменить" && !ctx.session.state.passingAuthorization) {
        await ctx.deleteMessage();
        await ctx.reply('.', { reply_markup: { remove_keyboard: true } });
        try { await ctx.api.deleteMessage(ctx.chatId!, ctx.msgId! + 1); } catch {};
        return;
    }
}

/**
 * Удаление сообщений при авторизации
 */
async function deleteMessageProcessing(
    ctx: MyContext,
    endMsgId?: number
) {
    try {

        const commandId =
            ctx.session.other.ids.commandCabinetId;

        // ❗ фикс: берём только явный endMsgId, иначе НЕ ctx.msgId
        const targetEndId =
            endMsgId;

        if (
            !commandId ||
            !targetEndId ||
            !ctx.chat?.id
        ) {
            return;
        }

        // ❗ защита от сломанного диапазона
        const start = Math.min(commandId, targetEndId);
        const end = Math.max(commandId, targetEndId);

        for (
            let id = end;
            id >= start;
            id--
        ) {
            try {
                await ctx.api.deleteMessage(
                    ctx.chat.id,
                    id
                );
            } catch {
                // игнорируем missing / already deleted
            }
        }

    } catch (error) {
        console.error(error);
    }
}

/**
 * Удаление кеша (списка) сообщений
 */
async function deleteCashMessages(ctx: MyContext) {
    for await (const messageId of ctx.session.other.ids.cash) {
        await ctx.api.deleteMessage(ctx.chatId!, messageId);
    }
    ctx.session.other.ids.cash = [];
}

/**
 * Проверка на телефон админа
 */
function isAdminPhone(phone: string) {
    return phone === constants.adminData.phone;
}

async function alertSendoutIsActive(ctx: MyContext) {
    await ctx.answerCallbackQuery({ text: ctx.t("utils.shared.titles.sendoutActive"), show_alert: true })
}

export default {
    resetSessionStates,
    setPrimaryValuesSession,
    isAdminPhone,
    deleteMessageProcessing,
    checkMaintenace,
    checkCancelButton,
    alertSendoutIsActive,
    deleteCashMessages
};