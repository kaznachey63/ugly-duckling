import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import db from '@shared/db';
import menuStatistic from '@menus/modules/shared/sendout/view/statistic';

const selectiveStatisticsComposer = new Composer<MyContext>();

selectiveStatisticsComposer.callbackQuery(/^selectiveStatistic:/, async (ctx: MyContext) => {
    try {
        const menu = menuStatistic.selective(ctx);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: "MarkdownV2"
        });
    } catch (error) {
        console.error('Ошибка в selectiveStatistic:', error);
    }
});

selectiveStatisticsComposer.callbackQuery(/^viewChats:/, async (ctx: MyContext) => {
    try {
        const resultId = Number(ctx.callbackQuery?.data!.split('#')[1]);
        ctx.session.result = await db.result.getById(resultId);

        const menu = menuStatistic.chats(ctx);
        await ctx.editMessageText(menu.text, {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в viewChats:', error);
    } finally {

    }
});

// Дата
selectiveStatisticsComposer.callbackQuery(/^calendar:date:(\d{4}-\d{2}-\d{2})$/, async (ctx) => {
    const results = await db.result.gets(ctx.session.sendout.id!);
    if (!results) await ctx.answerCallbackQuery({ text: ctx.t("modules.shared.sendout.view.sendout.statistic.selective.main.notDone"), show_alert: true });

    for (const result of results!) {
        // if (result.chats == 0 || result.chats == 1) continue;

        const targetDate = ctx.callbackQuery.data.split(/date:/)[1];
        const dateFromResult = result.date_time?.toISOString().split('T')[0];
        
        if (targetDate == dateFromResult) {
            ctx.session.result = result;
            const menu = menuStatistic.targetDateOnCalendar(ctx);
            await ctx.editMessageText(menu.text, {
                reply_markup: menu.keyboard,
                parse_mode: "MarkdownV2"
            });
            return;
        }
    }

    await ctx.answerCallbackQuery({ text: ctx.t("modules.shared.sendout.view.sendout.statistic.selective.main.noData"), show_alert: true });
});

// Недоступная кнопка
selectiveStatisticsComposer.callbackQuery(/^calendar:ignore:/, async (ctx) => {
    await ctx.answerCallbackQuery({ text: ctx.t("modules.shared.sendout.view.sendout.statistic.selective.main.noAccess"), show_alert: true });
});

// Пред. месяц
selectiveStatisticsComposer.callbackQuery(/^calendar:prev:(\d{4}-\d{2}-\d{2})$/, async (ctx) => {
    // Пусто
});

// След. месяц
selectiveStatisticsComposer.callbackQuery(/^calendar:next:(\d{4}-\d{2}-\d{2})$/, async (ctx) => {
    // Пусто
});

selectiveStatisticsComposer.callbackQuery(/^calendar:ignore:weekday$/, async (ctx) => {
    // Пусто
});

selectiveStatisticsComposer.callbackQuery(/^calendar:ignore:empty$/, async (ctx) => {
    // Пусто
});

selectiveStatisticsComposer.callbackQuery(/^calendar:ignore:disabled-\d+$/, async (ctx) => {
    // Пусто
});

selectiveStatisticsComposer.callbackQuery(/^calendar:ignore:month$/, async (ctx) => {
    // Пусто
});

export default selectiveStatisticsComposer;