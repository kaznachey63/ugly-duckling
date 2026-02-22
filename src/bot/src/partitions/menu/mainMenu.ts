import db from "@shared/db";
import utils from "@utils";
import cabinet from "@menus/cabinet";
import type { MyContext } from '@shared/types/SessionData';

export default async function cabinetHandler(ctx: MyContext) {
    try {
        // 1. ЛОГИКА: получаем данные
        const allCreds = await db.credential.getCred();
        if (!allCreds?.length) {
            return ctx.reply(ctx.t('cabinet.noCreds'));
        }

        let filtered: typeof allCreds = [];

        if (await db.user.userIsAdmin(ctx.from!.id)) {
            filtered = allCreds;
        } else {
            const phone = await db.user.getPhoneNumber(ctx.from!.id);
            if (!phone) return ctx.reply(ctx.t('cabinet.noPhone'));

            const rows = await utils.google.getRowsFromGS("Заказчики!A2:I");
            const labels = rows
                ?.filter(r => r[8] === phone)
                .map(r => r[0])
                .filter((v): v is string => !!v) || [];

            filtered = allCreds.filter(c => labels.includes(c.label));
        }

        if (!filtered.length) return ctx.reply(ctx.t('cabinet.noMailings'));

        // 2. Сортировка (твоя логика, без изменений)
        const sorted = filtered.sort((a, b) => {
            const displayA = a.call || a.label || a.name;
            const displayB = b.call || b.label || b.name;

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

        // 3. UI: генерируем меню
        const menu = cabinet.cabinetMenu(ctx, sorted);

        // 4. Отправка (с fallback)
        const replyOptions = {
            ...(menu.reply_markup && { reply_markup: menu.reply_markup })
        };

        try {
            await ctx.editMessageText(menu.text, replyOptions);
        } catch {
            await ctx.reply(menu.text, replyOptions);
        }

    } catch (e) {
        console.error(e);
        await ctx.reply(ctx.t('cabinet.error'));
    }
}