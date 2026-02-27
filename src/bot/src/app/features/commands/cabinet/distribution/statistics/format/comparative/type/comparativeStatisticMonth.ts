import HandlerComparativeStatistika from '../HandlerComparativeStatistika.js';
import type { MyContext } from '@shared/types/SessionData';

export default async function comparativeStatisticMonth(ctx: MyContext) {
    await HandlerComparativeStatistika(ctx, "month");
}
