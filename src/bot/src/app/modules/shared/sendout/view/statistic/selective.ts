import { Composer, InlineKeyboard } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import type { Chat } from '@shared/types/DB';
import type { Menu } from '@shared/types/Menu';
import db from '@shared/db';
import format from '@utils/formatting';
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

selectiveStatisticsComposer.callbackQuery(/^calendar:date:(\d{4}-\d{2}-\d{2})$/, async (ctx) => {
    const results = await db.result.get(ctx.session.sendout.id!);
    if (!results)  {     
        await ctx.answerCallbackQuery({
            text: ctx.t("modules.shared.sendout.view.sendout.statistic.selective.main.notDone"),
            show_alert: true
        });
    }
    for (const result of results!) {
        if (result.chats == 0 || result.chats == 1) continue;

        const targetDate = ctx.callbackQuery.data.split(/date:/)[1]?.replace(/-/g, ':');
        const dateFromResult = result.date_time?.getDate();
        console.log(
            ctx.callbackQuery.data,
            targetDate,
            dateFromResult
        );
        
        if (targetDate == dateFromResult) {
            const menu = menuStatistic.targetDateOnCalendar(ctx, result);
            await ctx.editMessageText(menu.text, {
                reply_markup: menu.keyboard,
                parse_mode: "MarkdownV2"
            });
            return;
        }
    }

    await ctx.answerCallbackQuery({ text: ctx.t("modules.shared.sendout.view.sendout.statistics.selective.noData"), show_alert: true });
});

selectiveStatisticsComposer.callbackQuery(/^calendar:ignore:/, async (ctx) => {
    // Пусто
});

selectiveStatisticsComposer.callbackQuery(/^calendar:prev:(\d{4}-\d{2}-\d{2})$/, async (ctx) => {
    // Пусто
});

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












// selectiveStatisticsComposer.callbackQuery(/^chatsForStatistics:/, async (ctx: MyContext) => {
//     try {
//         const logsBaza = await db.result.get(ctx.session.sendout.schema);
//         if (!logsBaza) return;

//         const lastLog = logsBaza.at(-1)!;
//         const infoChats = await db.chat.getInfo(lastLog?.chats);

//         if (logsBaza.length === 0 || !lastLog?.chats || !infoChats) {
//             await ctx.answerCallbackQuery({
//                 text: ctx.t("modules.commands.cabinet.distribution.chats.noSendout", {
//                     call: ctx.session.sendout.call
//                 }),
//                 show_alert: true
//             });
//             return;
//         }

//         const menu = chat(ctx, lastLog.success, infoChats!);
//         await ctx.editMessageText(format.escapeMarkdown(menu.text), {
//             parse_mode: 'MarkdownV2',
//             reply_markup: menu.keyboard
//         });
//     } catch (error) {
//         console.error('Ошибка в chatsForStatistics:', error);
//     } finally {

//     }
// });

/**
 * Меню раздела чаты
 */
// function chat(ctx: MyContext, success: number, chats: Chat[]): Menu<InlineKeyboard> {
//     const text = [
//         ctx.t("modules.commands.cabinet.distribution.chats.amount", { success }),
//         ctx.t("modules.commands.cabinet.distribution.chats.path", { call: ctx.session.sendout.call })
//     ].join('\n\n');

//     const keyboard = new InlineKeyboard();
//     chats.forEach((chat: Chat) => {
//         keyboard.url(chat.title, chat.link).row();
//     });
//     keyboard.text(ctx.t("utils.shared.buttons.back"), 'mainDistribution');

//     return { text: format.escapeMarkdown(text), keyboard };
// }

export default selectiveStatisticsComposer;