import type { MyContext, SessionData } from '@shared/types/SessionData';
import menuCabinet from "@menus/commands/cabinet/main";
import db from "@shared/db";
import utils from "src/common/utils";

/**
 * Сброс сессии
 * @param session Сессия
 */
function sessionReset(session: SessionData) {
    session.state.text.adding = false;
    session.state.text.updating = false;
    session.state.media.adding = false;
    session.state.time.adding = false;
    session.state.text.paginationId = 0;
    session.state.media.paginationId = 0;
}

/**
 * Подгрузка кабиента
 */
async function loadCabinet(ctx: MyContext) {
    // Получение рассылок
    const allCreds = await db.credential.getCred();
    if (!allCreds?.length) {
        return ctx.reply(ctx.t('cabinet.noCreds'));
    }

    let filtered: typeof allCreds = [];

    // Проверка на админа
    if (await db.user.userIsAdmin(ctx.from!.id)) {
        ctx.session.user.role = "admin";
        filtered = allCreds;
    }
    // Получение рассылок по номеру телефона из гугл таблов 
    else {
        const phone = await db.user.getPhoneNumber(ctx.from!.id);
        if (!phone) return ctx.reply(ctx.t('commands.cabinet.noPhone'));

        const rows = await utils.google.getRowsFromGS("Заказчики!A2:I");
        const labels = rows
            ?.filter(r => r[8] === phone)
            .map(r => r[0])
            .filter((v): v is string => !!v) || [];

        filtered = allCreds.filter(c => labels.includes(c.label));
    }

    // Нет рассылок (не заказчик) - отправляем уведомление
    if (!filtered.length) return ctx.reply(ctx.t('commands.cabinet.noSendouts'));

    // Сортировка
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

    const menu = menuCabinet.authed(ctx, sorted);

    // Отправка результата
    try {
        await ctx.editMessageText(menu.text, { reply_markup: menu.keyboard, parse_mode: "MarkdownV2" });
    } catch {
        await ctx.reply(menu.text, { reply_markup: menu.keyboard, parse_mode: "MarkdownV2" });
    }
}

/**
 * Задержка
 */
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Удаление двух сообщений (для обработчиков)
 */
// async function deleteTwoMessages(ctx: MyContext) {
//     try {
//         await ctx.deleteMessage();
//         // await ctx.deleteMessage(id - 1);
//     } catch {}
// }

export default {
    sessionReset,
    loadCabinet,
    sleep
};