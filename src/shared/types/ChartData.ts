import type { StatisticType } from "./StatisticType";

export interface ChartData {
    labels: string[],
    groups: number[],
    type: StatisticType,
    typeRu: string,
};