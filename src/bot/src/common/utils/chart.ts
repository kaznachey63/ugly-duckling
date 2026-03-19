import QuickChart from 'quickchart-js';
import type { ChartData } from '@shared/types/ChartData';
import type { MyContext } from '@shared/types/SessionData';

function createChart(ctx: MyContext, data: ChartData): QuickChart {
    const qc = new QuickChart();

    const config: any = {
        type: data.type === 'week' ? 'bar' : 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: ctx.t("utils.chart.label"),
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
                text: ctx.t("utils.chart.label", { motnh: '', year: '' })
            },
            scales: {
                xAxes: [{ scaleLabel: { display: true } }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 45,
                        stepSize: 10
                    },
                    scaleLabel: {
                        display: true,
                        labelString: ctx.t("utils.chart.amountSms"),
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
export default {
    createChart
}