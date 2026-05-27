import { Bot, session, type NextFunction } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import { i18nMiddleware } from '@i18n';
import utils from '@utils';
import modulesComposer from '@modules';
import eventsComposer from '@events';
import common from '@utils/common';

const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);
const commandCooldowns = new Map<number, number>();
const callbackLocks = new Set<number>();

/**
 * Ограничение использования бота вне переписки с ботом
 */
bot.use(async (ctx: MyContext, next: NextFunction) => {
    if (ctx.chat && ctx.chat.type !== 'private') return;
    next();
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
 * Корневая инициализация обработки сообщений
 */
bot.on('message', async (ctx: MyContext, next: NextFunction) => {
    // проверка на команду
    if (ctx.message?.text?.startsWith('/')) {
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
 * Запуск бота
 */
bot.start();

// bot.catch(async (err, ctx) => {
//     console.error(`Ошибка в обработчике:`, err);
//     if (ctx.updateType !== 'channel_post') {
//         if (ctx.message) try { await ctx.deleteMessage() } catch {};
//         await ctx.reply("⚠️ Что-то пошло не так. Мы уже чиним!").catch(() => { });
//     }
// });

/**
 * Защита от падения процесса
 */
// process.on("unhandledRejection", (error) => {
//     console.error('unhandledRejection', error);
// });

/**
 * Защита от падения процесса
 */
// process.on('uncaughtException', err => {
//     console.error('uncaughtException:', err);
// });