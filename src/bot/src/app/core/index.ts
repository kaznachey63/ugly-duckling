import '@shared/env'; // ← ОБЯЗАТЕЛЬНО ПЕРВОЙ СТРОКОЙ
import { Bot, session } from 'grammy';
import handler from './handlers';
import type { MyContext } from '@shared/types/SessionData';
import { i18nMiddleware } from 'src/ui/i18n';
import utils from '@utils';
import command from 'src/app/commands/index';

const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);

/**
 * Ограничение использования бота вне переписки с ботом
 */
bot.use(async (ctx, next) => {
    if (ctx.chat && ctx.chat.type !== 'private') return;
    return next();
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
 * 👇 Инициализация якобы, что бот печатает
 */
// bot.use(async (ctx, next) => {
//     if (ctx.message) {
//         bot.api.sendChatAction(1, "typing");
//     }

//     await next();
// });

// --------- Команды -------------------------
bot.command('start', async (ctx: MyContext) => {
    await command.start(ctx);
});

bot.command('help', async (ctx: MyContext) => {
    await command.help(ctx);
});

bot.command('about', async (ctx: MyContext) => {
    await command.about(ctx);
});

bot.command('cabinet', async (ctx: MyContext) => {
    await command.cabinet(ctx);
});

bot.command('form', async (ctx: MyContext) => {
    await command.form(ctx);
});

bot.command('settings', async (ctx: MyContext) => {
    await command.settings(ctx);
});
// -------------------------------

// ------------- Обработчики
bot.on('callback_query', async (ctx: MyContext) => {
    // const result = calendar.clickButtonCalendar(ctx);

    // if (result !== -1) {
    //     // Пользователь выбрал дату
    //     await ctx.reply(`Вы выбрали: ${result}`);
    // }

    // await ctx.answerCallbackQuery();
    await handler.callback_query(ctx);
});

bot.on('message:contact', async (ctx: MyContext) => {
    await handler.contact(ctx);
});

bot.on('message:text', async (ctx: MyContext) => {
    await handler.dispatchState(ctx, "text");
});

bot.on('message:photo', async (ctx: MyContext) => {
    await handler.dispatchState(ctx, "media");
});

bot.on('message:video', async (ctx: MyContext) => {
    await handler.dispatchState(ctx, "media");
});

bot.on('message:animation', async (ctx: MyContext) => {
    await handler.dispatchState(ctx, "media");
});

bot.on('message:document', async (ctx: MyContext) => {
    await handler.document(ctx);
});
// -------------------------------

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

bot.start();