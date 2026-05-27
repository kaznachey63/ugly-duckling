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
// async function setPrimaryValuesSession(ctx: MyContext) {
//     // Присваивание инфо о рассылке и пользователе
//     if (await db.user.exists(BigInt(ctx.from?.id!))) {
//         ctx.session.user = ctx.session.user.phone ? (await db.user.get(ctx.session.user.phone))! : (await db.user.get(BigInt(ctx.from?.id!)))!;
//     }
//     else {
//         // @ts-ignore
//         ctx.session.user.role.code = 'unknown';
//     }
//     // @ts-ignore
//     ctx.session.isAdmin = ctx.session.user?.role.code === "admin";

//     const sendoutId = Number(ctx?.callbackQuery?.data?.split(/:/)[1]?.split(/#/)[0]!);
//     const infoDist = await db.sendout.getSendoutInfo(sendoutId);
//     if (infoDist) ctx.session.sendout = infoDist;
// }
async function setPrimaryValuesSession(ctx: MyContext) {
    console.log('=== setPrimaryValuesSession START ===');

    console.log('ctx.from.id:', ctx.from?.id);

    console.log('ctx.session.user BEFORE:', ctx.session.user);

    const exists = await db.user.exists(BigInt(ctx.from?.id!));

    console.log('db.user.exists:', exists);

    // Присваивание инфо о рассылке и пользователе
    if (exists) {

        console.log('ctx.session.user.phone:', ctx.session.user?.phone);

        if (ctx.session.user?.phone) {

            console.log('GET USER BY PHONE START');

            const userByPhone = await db.user.get(ctx.session.user.phone);

            console.log('userByPhone:', userByPhone);

            ctx.session.user = userByPhone!;

            console.log('ctx.session.user AFTER PHONE:', ctx.session.user);

        } else {

            console.log('GET USER BY TELEGRAM ID START');

            const userByTelegramId = await db.user.get(BigInt(ctx.from?.id!));

            console.log('userByTelegramId:', userByTelegramId);

            ctx.session.user = userByTelegramId!;

            console.log('ctx.session.user AFTER TELEGRAM:', ctx.session.user);
        }

    } else {

        console.log('USER NOT EXISTS');

        // @ts-ignore
        ctx.session.user.role.code = 'unknown';

        console.log('ctx.session.user AFTER UNKNOWN:', ctx.session.user);
    }

    // @ts-ignore
    ctx.session.isAdmin = ctx.session.user?.role.code === "admin";

    console.log('ctx.session.isAdmin:', ctx.session.isAdmin);

    console.log('callback data:', ctx?.callbackQuery?.data);

    const sendoutId = Number(
        ctx?.callbackQuery?.data?.split(/:/)[1]?.split(/#/)[0]!
    );

    console.log('sendoutId:', sendoutId);

    const infoDist = await db.sendout.getSendoutInfo(sendoutId);

    console.log('infoDist:', infoDist);

    if (infoDist) {
        ctx.session.sendout = infoDist;

        console.log('ctx.session.sendout SET');
    }

    console.log('ctx.session.user FINAL:', ctx.session.user);

    console.log('=== setPrimaryValuesSession END ===');
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
        const msg = await ctx.reply('.', { reply_markup: { remove_keyboard: true } });
        try { await ctx.api.deleteMessage(ctx.chatId!, msg.message_id); } catch {};
        return;
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
function isAdminPhone(phone: string): boolean {
    return phone === constants.adminData.phone;
}

async function alertSendoutIsActive(ctx: MyContext) {
    return await ctx.answerCallbackQuery({ text: ctx.t("utils.shared.titles.sendoutActive"), show_alert: true })
}

export default {
    resetSessionStates,
    setPrimaryValuesSession,
    isAdminPhone,
    checkMaintenace,
    checkCancelButton,
    alertSendoutIsActive,
    deleteCashMessages
};