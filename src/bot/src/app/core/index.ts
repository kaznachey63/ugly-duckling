import '@shared/env'; // ← ОБЯЗАТЕЛЬНО ПЕРВОЙ СТРОКОЙ
import { Bot, session, type NextFunction } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import { i18nMiddleware } from '@i18n';
import utils from '@utils';
import modulesComposer from '@modules';
import eventsComposer from '@events';

const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);

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
 * Установка команд в меню бота
 */
await utils.init.setupBotCommands(bot);

/**
 * Инициализация якобы, что бот печатает после получения команд
 */
bot.on('message', async (ctx: MyContext, next: NextFunction) => {
    if (ctx.message?.text?.startsWith('/')) {
        await ctx.api.sendChatAction(ctx.chat?.id!, "typing");
    }
    await utils.common.setPrimaryValuesSession(ctx);
    console.log(ctx.chatId);
    
    next();
});

bot.on('callback_query', async (ctx: MyContext, next: NextFunction) => {
    try {
        console.log(ctx?.callbackQuery?.data);
        
        await utils.common.setPrimaryValuesSession(ctx);
        await next();
    } finally {
        await ctx.answerCallbackQuery().catch(() => { });        
    }
});

bot.use(modulesComposer);

bot.use(eventsComposer);

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

// const MAINTE NANCE = false;
/**
 * Режим разработчика
 */
// bot.use(async (ctx, next) => {
//     if (!MAINTENANCE) return next();

//     if (await db.user.userIsAdmin(ctx.from?.id!)) {
//         return next(); // админ проходит
//     }

//     if (ctx.message) try { await ctx.deleteMessage() } catch { };

//     const techText = "🛠 Сейчас ведутся технические работы.\nМы оповестим, когда всё заработает."

//     if (ctx.callbackQuery) {
//         await ctx.answerCallbackQuery({text: techText, show_alert: true});
//         return;
//     }

//     if (ctx.message) {
//         await ctx.reply(techText);
//     }

//     return; // ⛔ стоп всё
// });