import HandlerComparativeStatistika from '../HandlerComparativeStatistika.js';
import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function comparativeStatistikaMonth(ctx: MyContext) {
    await HandlerComparativeStatistika(ctx, "month");
}
