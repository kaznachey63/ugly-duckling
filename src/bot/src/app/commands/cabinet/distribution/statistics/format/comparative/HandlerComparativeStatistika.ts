import db from "@shared/db";
import utils from "@utils";
import type { MyContext } from '@shared/types/SessionData';
import type { ChartData } from '@shared/types/ChartData';
import type { StatisticType } from '@shared/types/StatisticType';
import menuStatistic from "@menus/commands/cabinet/distribution/statistic";

/**
 * Обработка типа сравнитальной статистики (неделя/месяц)
 */
export default async function HandlerComparativeStatistika(ctx: MyContext, typeStat: StatisticType) {    
    const data = await getDataForDiagram(ctx, typeStat);

    if (data === false) {
        await ctx.answerCallbackQuery({ text: ctx.t("utils.chart.noLogs"), show_alert: true });
        return;
    }

        await ctx.api.sendChatAction(ctx.chat?.id!, "upload_photo");
    const myChart = utils.chart.createChart(ctx, data);
    const menu = menuStatistic.handlerComparative(ctx, typeStat);

    await ctx.replyWithPhoto(await myChart.getShortUrl(), {
        caption: menu.text,
        reply_markup: menu.keyboard,
        parse_mode: "MarkdownV2"
    });
    try { await ctx.deleteMessage(); } catch { }
}

function getType(type: StatisticType): string[] {
    switch (type) {
        case 'week': {
            // return getWeek(new Date('2025-12-19'));
            return getWeek(new Date());
        }
        case 'month': {
            return getMonth(new Date());
        }
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

    const labelsTranslated = labels.map(l => {
        const dayOfWeek = l.split(' ')[0]!;
        const dateObj = new Date(l);
        const dayKey = dayOfWeek.slice(0, 3);
        const dayTranslated = ctx.t(`utils.chart.daysOfWeek.${dayKey}`);

        return `${String(dateObj.getDate()).padStart(2, '0')}.${String(dateObj.getMonth() + 1).padStart(2, '0')}\n${dayTranslated}`;
    });

    return labelsTranslated;
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

    const withoutSundays = monthDays.filter(day => !day.startsWith("Sun"));

    return withoutSundays;
}

async function getDataForDiagram(ctx: MyContext, typeStat: StatisticType): Promise<ChartData | false> {
    const groups = await getGroups(ctx.session.distribution.name, typeStat);
    
    if (Number(groups.join('')) <= 0) {   
        return false;
    }
    else {
        const labels = getLabels(ctx, typeStat);
        return {
            labels: labels,
            groups: groups,
            type: typeStat,
            typeRu: utils.local.getTypeCompStatRu(typeStat)
        };
    }
}