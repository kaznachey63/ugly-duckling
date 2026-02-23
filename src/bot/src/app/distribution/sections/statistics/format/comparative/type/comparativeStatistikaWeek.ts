import HandlerComparativeStatistika from '../HandlerComparativeStatistika.js';
import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function comparativeStatistikaWeek(ctx: MyContext) {
    await HandlerComparativeStatistika(ctx, "week");
}