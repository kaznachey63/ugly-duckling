import { Composer, InlineKeyboard } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import type { Chat } from '@shared/types/Chat';
import type { Menu } from '@shared/types/Menu';
import type { ChartData } from '@shared/types/ChartData';
import type { StatisticType } from '@shared/types/StatisticType';
import db from '@shared/db';
import utils from '@utils';
import format from '@utils/formatting';
import menuStatistic from '@menus/commands/cabinet/distribution/statistic';

const statisticsComposer = new Composer<MyContext>();

statisticsComposer.callbackQuery(/^mainStatistic:/, async (ctx: MyContext) => {
    try {        
        const menu = menuStatistic.main(ctx);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в mainStatistic:', error);
    } finally {
        
    }
});

statisticsComposer.callbackQuery(/^selectiveStatistic:/, async (ctx: MyContext) => {
    try {
        await ctx.answerCallbackQuery({
            text: ctx.t('commands.cabinet.distribution.statistics.selective.notDone'),
            show_alert: true
        });
    } catch (error) {
        console.error('Ошибка в selectiveStatistic:', error);
    }
});

statisticsComposer.callbackQuery(/^comparativeStatistic:/, async (ctx: MyContext) => {
    try {
        const menu = menuStatistic.comparative(ctx);
        try {
            await ctx.editMessageText(menu.text, {
                reply_markup: menu.keyboard,
                parse_mode: 'MarkdownV2'
            });
        } catch {
            try { await ctx.deleteMessage(); } catch { }
            await ctx.reply(menu.text, {
                reply_markup: menu.keyboard,
                parse_mode: 'MarkdownV2'
            });
        }
    } catch (error) {
        console.error('Ошибка в comparativeStatistic:', error);
    } finally {
        
    }
});

statisticsComposer.callbackQuery(/^comparativeStatisticWeek:/, async (ctx: MyContext) => {
    try {
        await handlerComparativeStatistika(ctx, 'week');
    } catch (error) {
        console.error('Ошибка в comparativeStatisticWeek:', error);
    } finally {
        
    }
});

statisticsComposer.callbackQuery(/^comparativeStatisticMonth:/, async (ctx: MyContext) => {
    try {
        await handlerComparativeStatistika(ctx, 'month');
    } catch (error) {
        console.error('Ошибка в comparativeStatisticMonth:', error);
    } finally {
        
    }
});

statisticsComposer.callbackQuery(/^chatsForStatistics:/, async (ctx: MyContext) => {
    try {
        const nameDistribution = ctx.session.distribution.name!;
        const logsBaza = await db.result.getResults(nameDistribution);
        if (!logsBaza) return;

        const lastLog = logsBaza.at(-1)!;
        const infoChats = await db.chat.getChatsInfo(lastLog?.chats);

        if (logsBaza.length === 0 || !lastLog?.chats || !infoChats) {
            await ctx.answerCallbackQuery({
                text: ctx.t('commands.cabinet.distribution.chats.noSendout', {
                    call: ctx.session.distribution.call
                }),
                show_alert: true
            });
            return;
        }

        const menu = chat(ctx, lastLog.success, infoChats!);
        await ctx.editMessageText(format.escapeMarkdown(menu.text), {
            parse_mode: 'MarkdownV2',
            reply_markup: menu.keyboard
        });
    } catch (error) {
        console.error('Ошибка в chatsForStatistics:', error);
    } finally {

    }
});

/**
 * Меню раздела чаты
 */
function chat(ctx: MyContext, success: number, chats: Chat[]): Menu<InlineKeyboard> {
    const text = [
        ctx.t('commands.cabinet.distribution.chats.amount', { success }),
        ctx.t('commands.cabinet.distribution.chats.path', { call: ctx.session.distribution.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard();
    chats.forEach((chat: Chat) => {
        keyboard.url(chat.title, chat.link).row();
    });
    keyboard.text(ctx.t('utils.shared.back'), 'mainDistribution');

    return { text: format.escapeMarkdown(text), keyboard };
}

/**
 * Обработка типа сравнительной статистики
 */
async function handlerComparativeStatistika(ctx: MyContext, typeStat: StatisticType) {
    const data = await getDataForDiagram(ctx, typeStat);

    if (data === false) {
        await ctx.answerCallbackQuery({ text: ctx.t('utils.chart.noLogs'), show_alert: true });
        return;
    }

    await ctx.api.sendChatAction(ctx.chat?.id!, 'upload_photo');
    const myChart = utils.chart.createChart(ctx, data);
    const menu = menuStatistic.handlerComparative(ctx, typeStat);

    await ctx.replyWithPhoto(await myChart.getShortUrl(), {
        caption: menu.text,
        reply_markup: menu.keyboard,
        parse_mode: 'MarkdownV2'
    });
    try { await ctx.deleteMessage(); } catch { }
}

function getType(type: StatisticType): string[] {
    switch (type) {
        case 'week': return getWeek(new Date());
        case 'month': return getMonth(new Date());
    }
}

async function getGroups(nameDistribution: string, typeStat: StatisticType): Promise<number[]> {
    const logs = await db.result.getResults(nameDistribution);
    if (!logs) return [];

    const dates = getType(typeStat);
    const formattedDates = dates.map(d => formatDate(new Date(d)));

    return formattedDates.map(date => {
        const logsForDate = logs.filter(l => l.date === date);
        if (logsForDate.length === 0) return 0;
        const bestLog = logsForDate.reduce((max, current) =>
            current.success > max.success ? current : max
        );
        return bestLog.success;
    });
}

function formatDate(date: Date): string {
    return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
}

function getLabels(ctx: MyContext, typeStat: StatisticType): string[] {
    const labels = getType(typeStat);
    return labels.map(l => {
        const dayOfWeek = l.split(' ')[0]!;
        const dateObj = new Date(l);
        const dayKey = dayOfWeek.slice(0, 3);
        const dayTranslated = ctx.t(`utils.chart.daysOfWeek.${dayKey}`);
        return `${String(dateObj.getDate()).padStart(2, '0')}.${String(dateObj.getMonth() + 1).padStart(2, '0')}\n${dayTranslated}`;
    });
}

function getWeek(date: Date): string[] {
    const dayOfWeek = date.getDay();
    const mondayOffset = (dayOfWeek + 6) % 7;
    const monday = new Date(date);
    monday.setDate(date.getDate() - mondayOffset);

    const week: string[] = [];
    for (let i = 0; i < 6; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        week.push(d.toDateString());
    }
    return week;
}

function getMonth(date: Date): string[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthDays: string[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day);
        monthDays.push(d.toDateString());
    }
    return monthDays.filter(day => !day.startsWith('Sun'));
}

async function getDataForDiagram(ctx: MyContext, typeStat: StatisticType): Promise<ChartData | false> {
    const groups = await getGroups(ctx.session.distribution.name, typeStat);
    if (Number(groups.join('')) <= 0) return false;

    return {
        labels: getLabels(ctx, typeStat),
        groups,
        type: typeStat,
        typeRu: utils.local.getTypeCompStatRu(typeStat)
    };
}

export default statisticsComposer;