import { Composer, GrammyError } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import menuSendout from '@menus/modules/cabinet/sendout/main';
import conditionComposer from './condition';
import contractComposer from './contract';
import scheduleComposer from './schedule';
import statisticsComposer from './statistics';
import messageComposer from './messages';
import mainComposer from './main';
import db from '@shared/db';

const distributionComposer = new Composer<MyContext>();

distributionComposer.callbackQuery(/^mainSendouts/, async (ctx: MyContext) => {
    // Удаление контакта на всякий случай
    // await ctx.reply(ctx.t("utils.shared.processing"), { reply_markup: { remove_keyboard: true } });        

    // Получение рассылок
    const sendouts = await db.user.userIsAdmin(ctx.from!.id) ? await db.distribution.getAllSendouts() : await db.distribution.getSendoutsOfUserId(ctx.from?.id!);
    if (!sendouts) return ctx.reply(ctx.t('commands.cabinet.main.noSendouts'));
    // console.log(sendouts);
    
    // Сортировка
    const sorted = sendouts.sort((a: any, b: any) => {
        const displayA = a.call_ru || a.label || a.name;
        const displayB = b.call_ru || b.label || b.name;

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

distributionComposer.use(mainComposer);
distributionComposer.use(messageComposer);
distributionComposer.use(conditionComposer);
distributionComposer.use(contractComposer);
distributionComposer.use(scheduleComposer);
distributionComposer.use(statisticsComposer);

export default distributionComposer;