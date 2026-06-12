import { Bot, session, type NextFunction } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import { i18nMiddleware } from '@i18n';
import utils from '@utils';
import modulesComposer from '@modules';
import eventsComposer from '@events';
import common from '@utils/common';
import db from '@shared/db';

const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);
const commandCooldowns = new Map<number, number>();
const callbackLocks = new Set<number>();

/**
 * Ограничение использования бота вне переписки с ботом
 */
bot.use(async (ctx: MyContext, next: NextFunction) => {
    if (ctx.chat && ctx.chat.type !== 'private') return;
    await next();
});

/**
 * Инициализация сессии
 */
bot.use(session({ initial: utils.init.createDefaultSession }));

/**
 * Инициалицация многоязычности
 */
bot.use(i18nMiddleware);

/**
 * Проверка существования пользователя
 */
bot.use(async (ctx: MyContext, next: NextFunction) => {
    // Пользователь не авторизован — пропускаем
    if (!ctx.session.user) {
        return next();
    }

    const exists = await db.user.exists(BigInt(ctx.from!.id));

    if (!exists) {
        ctx.session = utils.init.createDefaultSession();
    }

    await next();
});

/**
 * Корневая инициализация обработки сообщений
 */
bot.on('message', async (ctx: MyContext, next: NextFunction) => {
    // проверка на занятость всех флагов
    const isIdle = Object.values(ctx.session.state).every((value) => value === false);
    
    // проверка на команду
    if (isIdle && !ctx.session.state.passingAuthorization && /^\/[a-zA-Z0-9_]+$/.test(ctx.message?.text!)) {
        if (!utils.init.rateLimitCommands(ctx, commandCooldowns)) return; // если спам командами
        await ctx.api.sendChatAction(ctx.chat?.id!, "typing"); // бот "печатает"
        common.resetSessionStates(ctx.session); // сброс состояний сессии
    }

    await utils.common.checkCancelButton(ctx); // проверка на кнопку 'отменить' из авторизации без состояния
    await utils.common.setPrimaryValuesSession(ctx); // установка важных параметров в сесии
    if (!await utils.common.checkMaintenace(ctx)) await next(); // проверка на тех. режим
});

/**
 * Корневая инициализация обработки нажатий на кнопки
 */
bot.on('callback_query', async (ctx: MyContext, next: NextFunction) => {
    try {
        // проверка: заблокировано ли управление кнопками
        if (!utils.init.lockCallback(ctx, callbackLocks)) return;

        console.log(ctx?.callbackQuery?.data); // лог коллбека для отладки
        await utils.common.setPrimaryValuesSession(ctx); // установка важных параметров в сесии
        if (!await utils.common.checkMaintenace(ctx)) await next(); // проверка на тех. режим


    } finally {
        utils.init.unlockCallback(ctx, callbackLocks); 
        await ctx.answerCallbackQuery().catch(() => { }); // глушение необработанных нажатий на кнопку                  
    }
});

/**
 * Инициализация модулей (обработчиков кнопок и команд)
 */
bot.use(modulesComposer);

/**
 * Инициализация событий (прием сообщений)
 */
bot.use(eventsComposer);

/**
 * Логирование ошибок бота
 */
bot.catch((error) => {
    console.error("BOT ERROR:", error);
});

/**
 * Ловля необработанных ошибок от промисов
 */
process.on("unhandledRejection", (error) => {
    console.error('unhandledRejection', error);
});

/**
 * Ловля необработанных ошибок throw
 */
process.on('uncaughtException', (error) => {
    console.error('uncaughtException:', error);
});

/**
 * Запуск бота
 */
bot.start();