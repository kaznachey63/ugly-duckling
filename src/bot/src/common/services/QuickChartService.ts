import QuickChart from 'quickchart-js';
import type { ChartData } from '@shared/types/ChartData';
import type { MyContext } from '@shared/types/SessionData';
import constants from '@constants';

export class QuickChartService {
    createChart(ctx: MyContext, data: ChartData): QuickChart {
        const qc = new QuickChart();
        const isWeek = data.type === 'week';
        const isMonth = data.type === 'month';

        qc.setConfig({
            type: isWeek ? 'bar' : 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: ctx.t("utils.constants.chart.label"),
                    data: data.groups,
                    borderWidth: constants.chart.dataset.borderWidth,
                    tension: isMonth ? constants.chart.dataset.tensionMonth : constants.chart.dataset.tensionWeek,
                    pointRadius: isMonth ? constants.chart.dataset.pointRadiusMonth : 0,
                    backgroundColor: isWeek ? constants.chart.dataset.backgroundColorBar : undefined,
                    borderColor: isMonth ? constants.chart.dataset.borderColorLine : undefined,
                }]
            },
            options: {
                title: {
                    display: true,
                    text: ctx.t("utils.constants.chart.label", { motnh: '', year: '' })
                },
                scales: {
                    xAxes: [{ scaleLabel: { display: true } }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            min: constants.chart.axis.yMin,
                            suggestedMax: constants.chart.axis.yMax,
                            stepSize: constants.chart.axis.stepSize
                        },
                        scaleLabel: {
                            display: true,
                            labelString: ctx.t("utils.constants.chart.amountSms"),
                            fontSize: constants.chart.axis.fontSize
                        }
                    }]
                },
                plugins: {
                    datalabels: {
                        ...constants.chart.datalabels,
                        formatter: (value: number) => value === 0 ? null : value
                    }
                },
                legend: { display: false }
            }
        });

        qc.setWidth(isWeek ? constants.chart.canvas.week.width : constants.chart.canvas.month.width);
        qc.setHeight(isWeek ? constants.chart.canvas.week.height : constants.chart.canvas.month.height);
        qc.setBackgroundColor(constants.chart.backgroundColor);

        return qc;
    }
}