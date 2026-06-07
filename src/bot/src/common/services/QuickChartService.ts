import QuickChart from 'quickchart-js';
import type { ChartData } from '@shared/types/ChartData';
import type { MyContext } from '@shared/types/SessionData';
import constants from '@constants';

export class QuickChartService {
    static createChart(ctx: MyContext, data: ChartData): QuickChart {
        const qc = new QuickChart();
        const isWeek = data.type === 'week';
        const isMonth = data.type === 'month';

        const now = new Date();
        const monthKeys = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        const monthName = ctx.t(`utils.chart.months.${monthKeys[now.getMonth()]}`);
        const year = now.getFullYear();

        qc.setConfig({
            type: isWeek ? 'bar' : 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.groups,
                    borderWidth: constants.chart.dataset.borderWidth,
                    tension: isMonth ? constants.chart.dataset.tensionMonth : constants.chart.dataset.tensionWeek,
                    pointRadius: isMonth ? constants.chart.dataset.pointRadiusMonth : 0,
                    backgroundColor: isWeek ? constants.chart.dataset.backgroundColorBar : undefined,
                    borderColor: isMonth ? constants.chart.dataset.borderColorLine : undefined,
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: data.type === 'month'
                            ? ctx.t("utils.chart.labelMonth", { month: monthName, year: year.toString() })
                            : ctx.t("utils.chart.labelWeek")
                    },
                    legend: { display: false },
                    datalabels: {
                        ...constants.chart.datalabels,
                        anchor: 'end',
                        align: 'top',
                        offset: 4,
                        clip: false,
                        formatter: (value: number) => value === 0 ? null : value
                    } as any
                },
                scales: {
                    x: {
                        title: {
                            display: true
                        }
                    },
                    y: {
                        beginAtZero: true,
                        min: constants.chart.axis.yMin,
                        suggestedMax: constants.chart.axis.yMax,
                        ticks: {
                            stepSize: constants.chart.axis.stepSize
                        },
                        title: {
                            display: true,
                            text: ctx.t("utils.chart.amountSms"),
                            font: {
                                size: constants.chart.axis.fontSize
                            }
                        }
                    }
                }
            } as any
        });

        qc.setWidth(isWeek ? constants.chart.canvas.week.width : constants.chart.canvas.month.width);
        qc.setHeight(isWeek ? constants.chart.canvas.week.height : constants.chart.canvas.month.height);
        qc.setBackgroundColor(constants.chart.backgroundColor);

        return qc;
    }
}