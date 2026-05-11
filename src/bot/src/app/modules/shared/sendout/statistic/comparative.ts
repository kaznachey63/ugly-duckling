import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import type { ChartData } from '@shared/types/ChartData';
import type { StatisticType } from '@shared/types/StatisticType';
import db from '@shared/db';
import utils from '@utils';
import menuStatistic from '@menus/modules/shared/sendout/statistic';
import { QuickChartService } from "src/common/services/QuickChartService";

const comparativeStatisticsComposer = new Composer<MyContext>();

comparativeStatisticsComposer.callbackQuery(/^comparativeStatistic:(.+)-([a-zA-Z]+)$/, async (ctx: MyContext) => {
    const typeStatistic = ctx.callbackQuery?.data?.split(/-/)[1] as StatisticType;
    try {
        await handlerComparativeStatistika(ctx, typeStatistic);
    } catch (error) {
        console.error('Ошибка в comparativeStatisticWeek:', error);
    } finally {

    }
});

comparativeStatisticsComposer.callbackQuery(/^comparativeStatistic:/, async (ctx: MyContext) => {
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

/**
 * Обработка типа сравнительной статистики
 */
async function handlerComparativeStatistika(ctx: MyContext, typeStat: StatisticType) {
    const data = await getDataForDiagram(ctx, typeStat);

    if (data === false) {
        await ctx.answerCallbackQuery({ text: ctx.t("utils.chart.noLogs"), show_alert: true });
        return;
    }

    await ctx.api.sendChatAction(ctx.chat?.id!, 'upload_photo');
    const chart = new QuickChartService()
    const myChart = chart.createChart(ctx, data);
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

async function getGroups(sendoutId: number, typeStat: StatisticType): Promise<number[]> {
    const results = await db.result.gets(sendoutId);
    if (!results) return [];

    const dates = getType(typeStat);
    const targetKeys = dates.map(d => {
        const date = new Date(d);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    });

    return targetKeys.map(key => {
        const logsForDate = results.filter(l => {
            const logDate = new Date(l.date_time!);
            const logKey = `${logDate.getFullYear()}-${String(logDate.getMonth() + 1).padStart(2, '0')}-${String(logDate.getDate()).padStart(2, '0')}`;
            return logKey === key;
        });
        if (logsForDate.length === 0) return 0;
        const bestLog = logsForDate.reduce((max, current) =>
            current.success! > max.success! ? current : max
        );
        return bestLog.success!;
    });
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
    const groups = await getGroups(ctx.session.sendout.id!, typeStat);
    if (Number(groups.join('')) <= 0) return false;

    return {
        labels: getLabels(ctx, typeStat),
        groups,
        type: typeStat,
    };
}

export default comparativeStatisticsComposer;