import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import type { StatisticType } from '@shared/types/StatisticType';
import utils from '@utils';
import { CalendarKeyboard } from 'src/ui/calendar';
import constants from '@constants';

/**
 * Меню раздела Статистика
 */
function main(ctx: MyContext): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.sendout?.name;

    const text = [
        ctx.t("commands.cabinet.distribution.statistics.main.title"),
        ctx.t("commands.cabinet.distribution.statistics.main.path", { call: ctx.session.sendout.call })
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard()
        .text(ctx.t("commands.cabinet.distribution.statistics.main.buttons.selective"), `selectiveStatistic:${nameDistribution}`)
        .text(ctx.t("commands.cabinet.distribution.statistics.main.buttons.comparative"), `comparativeStatistic:${nameDistribution}`).row()
        .text(ctx.t("utils.shared.buttons.back"), `mainDistribution:${nameDistribution}`)
    ;
    return { text: utils.formatting.escapeMarkdown(text), keyboard }

}

function selective(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("commands.cabinet.distribution.statistics.selective.main.title"),
        ctx.t("commands.cabinet.distribution.statistics.selective.main.path", { call: ctx.session.sendout.call })
    ].join('\n\n');

    // Создаем экземпляр с параметрами (все опционально)
    const calendar = new CalendarKeyboard({
        minDate: new Date(constants.calendar.minDate),      // Минимальная дата для выбора
        maxDate: new Date(constants.calendar.minDate),      // Максимальная дата
        startWeekDay: 1,                      // 1 = Пн, 0 = Вс
        locale: ctx.from?.language_code!, // Динамический язык из контекста
    });

    const keyboard = 
        calendar.generate(new Date(), ctx.from?.id!)
        .row().text(ctx.t('utils.shared.buttons.back'), `mainStatistic:${ctx.session.sendout.name}`)
    ;

    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

function targetDateOnCalendar(ctx: MyContext, result: { time: string, date: string, success: number, chats: string[] }): Menu<InlineKeyboard> {
    const text = [
        ctx.t(`commands.cabinet.distribution.statistics.selective.targetDate.title`, { date: result.date, time: result.time, success: result.success }),
        ctx.t(`commands.cabinet.distribution.statistics.selective.targetDate.path`, { call: ctx.session.sendout.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard();
    if (utils.common.isAdmin(ctx)) keyboard.text(ctx.t('commands.cabinet.distribution.statistics.selective.targetDate.buttonChats'), `readChats:${ctx.session.sendout.name}-${result.date}`);
    keyboard.text(ctx.t('utils.shared.buttons.back'), `comparativeStatistic:${ctx.session.sendout.name}`);

    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

function comparative(ctx: MyContext): Menu<InlineKeyboard> {
    const nameDistribution = ctx.session.sendout.name;

    const text = [
        ctx.t("commands.cabinet.distribution.statistics.comparative.main.title"),
        ctx.t("commands.cabinet.distribution.statistics.comparative.main.path", { call: ctx.session.sendout.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("commands.cabinet.distribution.statistics.comparative.main.buttons.week"), `comparativeStatistic:${nameDistribution}-week`)
        .text(ctx.t("commands.cabinet.distribution.statistics.comparative.main.buttons.month"), `comparativeStatistic:${nameDistribution}-month`).row()
        .text(ctx.t('utils.shared.buttons.back'), `mainStatistic:${ctx.session.sendout.name}`)
    ;
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

function handlerComparative(ctx: MyContext, type: StatisticType): Menu<InlineKeyboard> {
    const text = [
        ctx.t(`commands.cabinet.distribution.statistics.comparative.${type}.title`),
        ctx.t(`commands.cabinet.distribution.statistics.comparative.${type}.path`, { call: ctx.session.sendout.call })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t('utils.shared.buttons.back'), `comparativeStatistic:${ctx.session.sendout.name}`);    
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

export default {
    main,
    selective,
    comparative,
    handlerComparative,
    targetDateOnCalendar
}