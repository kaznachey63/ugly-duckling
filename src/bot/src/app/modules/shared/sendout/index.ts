import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuSendout from '@menus/modules/shared/sendout/main';
import scheduleComposer from './schedule';
import statisticsComposer from './statistic';
import messageComposer from './message';
import db from '@shared/db';
import type { Sendout } from '@shared/types/DataBase';
import ownerComposer from './owner';
import callComposer from './name';
import viewComposer from './view';
import testComposer from './test';

const sendoutComposer = new Composer<MyContext>();

sendoutComposer.callbackQuery("mainSendout", async (ctx: MyContext) => {
    // Получение рассылок
    const sendouts = ctx.session.isAdmin ? await db.sendout.getSendouts() : await db.sendout.getSendoutsOfUserId(BigInt(ctx.from?.id!));
    
    // Сортировка
    const sorted = sendouts.sort((a: Sendout, b: Sendout) => {
        const displayA = a.call ?? a.label;
        const displayB = b.call ?? b.label;

        // 1. "Тест" — всегда первым
        if (displayA === 'Тест') return -1;
        if (displayB === 'Тест') return 1;

        // 2. Шаблон "Любой текст №число"
        const regex = /^(.+?)\s*№(\d+)$/i;
        const matchA = displayA!.match(regex);
        const matchB = displayB!.match(regex);

        if (matchA && matchB) {
            const prefixA = matchA[1]!.trim();
            const prefixB = matchB[1]!.trim();
            const numA = parseInt(matchA[2]!, 10);
            const numB = parseInt(matchB[2]!, 10);

            const prefixCompare = prefixA.localeCompare(prefixB, 'ru', { sensitivity: 'base' });
            if (prefixCompare !== 0) return prefixCompare;
            return numA - numB;
        }

        if (matchA) return -1;
        if (matchB) return 1;

        // 3. Остальные — алфавитный порядок
        return displayA!.localeCompare(displayB!, 'ru', { sensitivity: 'base' });
    });

    const menu = menuSendout(ctx, sorted);

    await ctx.editMessageText(menu.text, { reply_markup: menu.keyboard, parse_mode: "MarkdownV2" });
});

sendoutComposer.use(viewComposer);
sendoutComposer.use(messageComposer);
sendoutComposer.use(scheduleComposer);
sendoutComposer.use(statisticsComposer);
sendoutComposer.use(ownerComposer);
sendoutComposer.use(callComposer);
sendoutComposer.use(testComposer);

export default sendoutComposer;