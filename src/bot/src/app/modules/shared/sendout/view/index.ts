import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuSendout from '@menus/modules/shared/sendout/view/main';
import conditionComposer from './condition';
import scheduleComposer from './schedule';
import statisticsComposer from './statistic';
import messageComposer from './message';
import db from '@shared/db';
import type { Sendout } from '@shared/types/Sendout';

const viewComposer = new Composer<MyContext>();

viewComposer.callbackQuery("viewSendouts", async (ctx: MyContext) => {
    // Удаление контакта на всякий случай
    // await ctx.reply(ctx.t("utils.shared.processing"), { reply_markup: { remove_keyboard: true } });        

    // Получение рассылок
    const sendouts = ctx.session.isAdmin ? await db.sendout.getAllSendouts() : await db.sendout.getSendoutsOfUserId(ctx.from?.id!);
    if (!sendouts.length) return ctx.answerCallbackQuery({ text: ctx.t("modules.commands.cabinet.distribution.main.sendouts.noSendouts"), show_alert: true });
    
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

    const menu = menuSendout.viewSendouts(ctx, sorted);

    await ctx.editMessageText(menu.text, { reply_markup: menu.keyboard, parse_mode: "MarkdownV2" });
});

viewComposer.callbackQuery(/^viewSendout:/, async (ctx: MyContext) => {
    try {
        const menu = menuSendout.viewSendout(ctx);
        await ctx.editMessageText(menu.text, {
            reply_markup: menu.keyboard,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.error('Ошибка в viewSendout:', error);
        throw error;
    } 
});

viewComposer.use(messageComposer);
viewComposer.use(conditionComposer);
viewComposer.use(scheduleComposer);
viewComposer.use(statisticsComposer);

export default viewComposer;