import db from "@shared/db";
import utils from "src/common/utils";
import type { MyContext } from '@shared/types/SessionData';
import type { ChartData } from '@shared/types/ChartData';
import type { StatisticType } from '@shared/types/StatisticType';
import menuStatistic from "@menus/commands/cabinet/distribution/statistic";

/**
 * Обработка типа сравнитальной статистики (неделя/месяц)
 */
export default async function HandlerComparativeStatistika(ctx: MyContext, typeStat: StatisticType) {
    ctx.api.sendChatAction(ctx.chat?.id!, "upload_photo");
    
    const nameDistribution = ctx.session.distribution.name;
    const myChart = utils.chart.createChart(ctx, await getDataForDiagram(nameDistribution, typeStat));
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
        const log = logs.find(l => l.date === date);
        return log ? log.success : 0;
    });
}

function formatDate(date: Date): string {
    return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
}

function getLabels(typeStat: StatisticType): string[] {
    const labels = getType(typeStat);
    const labelsRu = labels.map(l => {
        const dayOfWeek = l.split(' ')[0]!;
        const dateObj = new Date(l);
        return `${String(dateObj.getDate()).padStart(2, '0')}.${String(dateObj.getMonth() + 1).padStart(2, '0')}\n${utils.local.getDayOfWeekRu(dayOfWeek!)}`;
    });

    return labelsRu;
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

async function getDataForDiagram(nameDistribution: string, typeStat: StatisticType): Promise<ChartData> {
    const groups = await getGroups(nameDistribution, typeStat);
    const labels = getLabels(typeStat);
    return {
        labels: labels,
        groups: groups,
        type: typeStat,
        typeRu: utils.local.getTypeCompStatRu(typeStat)
    };
}