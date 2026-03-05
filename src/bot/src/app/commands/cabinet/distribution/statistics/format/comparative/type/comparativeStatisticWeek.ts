import HandlerComparativeStatistika from '../HandlerComparativeStatistika';
import type { MyContext } from '@shared/types/SessionData';

export default async function comparativeStatisticWeek(ctx: MyContext) {
    await HandlerComparativeStatistika(ctx, "week");
}