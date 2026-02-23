import db from "@shared/db";
import utils from "src/common/utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';
import QuickChart from 'quickchart-js';
import type { IData } from '@shared/types/IData';

type TypeStatistika = "week" | "month";

export default async function HandlerComparativeStatistika(ctx: MyContext, typeStat: TypeStatistika) {
    ctx.sendChatAction("upload_photo");
    
    const nameDistribution = ctx.session.distribution.name;

    const myChart = createChart(await getDataForDiagram(nameDistribution, typeStat));

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.callback("🔙 Назад", `comparativeStatistika${nameDistribution}`)]
    ]);

    await ctx.replyWithPhoto(
        { url: await myChart.getShortUrl() },
        {
            caption: utils.formatting.escapeMarkdown(
                `Сравнительная статистика. (${utils.local.getTypeCompStatRu(typeStat)})
                \n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → Статистика → Сравнительная → *${utils.local.getTypeCompStatRu(typeStat)}*]`
            ),
            parse_mode: "MarkdownV2",
            ...keyboard
        }
    );
    try { await ctx.deleteMessage(); } catch (e) { }
}

function getType(type: TypeStatistika): string[] {
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

async function getGroups(nameDistribution: string, typeStat: TypeStatistika): Promise<number[]> {
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

function getLabels(typeStat: TypeStatistika): string[] {
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

async function getDataForDiagram(nameRasssilka: string, typeStat: TypeStatistika): Promise<IData> {
    const groups = await getGroups(nameRasssilka, typeStat);
    const labels = getLabels(typeStat);
    return {
        labels: labels,
        groups: groups,
        type: typeStat,
        typeRu: utils.local.getTypeCompStatRu(typeStat)
    };
}

function createChart(data: IData): QuickChart {
    const qc = new QuickChart();

    const config: any = {
        type: data.type === 'week' ? 'bar' : 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Количество групп, получивших рассылку',
                data: data.groups,
                borderWidth: 2,
                tension: data.type === 'month' ? 0.35 : 0,
                pointRadius: data.type === 'month' ? 2 : 0,
                backgroundColor: data.type === 'week' ? 'rgba(54, 162, 235, 0.7)' : undefined,
                borderColor: data.type === 'month' ? 'rgba(54, 162, 235, 1)' : undefined,
            }]
        },
        options: {
            title: {
                display: true,
                text: `Статистика отправленных сообщений (${data.typeRu})`
            },
            scales: {
                xAxes: [{ scaleLabel: { display: true } }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 40,
                        stepSize: 10
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Количество сообщений',
                        fontSize: 14
                    }
                }]
            },
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    color: '#fff',
                    backgroundColor: 'rgba(34, 139, 34, 0.6)',
                    borderColor: 'rgba(34, 139, 34, 1.0)',
                    borderWidth: 1,
                    borderRadius: 5,
                    display: true,
                    formatter: (value: number) => {
                        return value === 0 ? null : value;
                    }
                }
            },
            legend: { display: false }
        }
    };

    qc.setConfig(config);

    // размеры
    qc.setWidth(data.type === 'week' ? 900 : 1200);
    qc.setHeight(data.type === 'week' ? 450 : 600);
    qc.setBackgroundColor('white');

    return qc;
}