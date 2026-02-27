import HandlerComparativeStatistika from '../HandlerComparativeStatistika.js';
import type { MyContext } from '@shared/types/SessionData';

export default async function comparativeStatistikaWeek(ctx: MyContext) {
    await HandlerComparativeStatistika(ctx, "week");
}