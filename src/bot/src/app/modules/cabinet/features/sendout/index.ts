import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuSendout from '@menus/modules/cabinet/sendout/main';
import conditionComposer from './condition';
import scheduleComposer from './schedule';
import statisticsComposer from './statistics';
import messageComposer from './messages';
import mainComposer from './main';
import db from '@shared/db';
import type { Sendout } from '@shared/types/Sendout';
import common from '@utils/common';

const sendoutComposer = new Composer<MyContext>();

sendoutComposer.callbackQuery(/^mainSendouts/, async (ctx: MyContext) => {
    // Удаление контакта на всякий случай
    // await ctx.reply(ctx.t("utils.shared.processing"), { reply_markup: { remove_keyboard: true } });        

    // Получение рассылок
    const sendouts = common.isAdmin(ctx.session.user.role) ? await db.sendout.getAllSendouts() : await db.sendout.getSendoutsOfUserId(ctx.from?.id!);
    if (!sendouts.length) return ctx.answerCallbackQuery({ text: ctx.t('commands.cabinet.distribution.main.sendouts.noSendouts'), show_alert: true });
    
    // Сортировка
    const sorted = sendouts.sort((a: Sendout, b: Sendout) => {
        const displayA = a.call ?? a.label;
        const displayB = b.call ?? b.label;

        // 1. "Тест" — всегда первым
        if (displayA === 'Тест') return -1;
        if (displayB === 'Тест') return 1;

        // 2. Шаблон "Любой текст №число"
        const regex = /^(.+?)\s*№(\d+)$/i;
        const matchA = displayA.match(regex);
        const matchB = displayB.match(regex);

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
        return displayA.localeCompare(displayB, 'ru', { sensitivity: 'base' });
    });

    const menu = menuSendout.mainSendouts(ctx, sorted);

    await ctx.editMessageText(menu.text, { reply_markup: menu.keyboard, parse_mode: "MarkdownV2" });
});

sendoutComposer.use(mainComposer);
sendoutComposer.use(messageComposer);
sendoutComposer.use(conditionComposer);
sendoutComposer.use(scheduleComposer);
sendoutComposer.use(statisticsComposer);

export default sendoutComposer;