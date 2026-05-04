import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import type { StatisticType } from '@shared/types/StatisticType';
import utils from '@utils';
import { CalendarKeyboard } from 'src/ui/calendar';
import constants from '@constants';
import type { Result } from '@shared/types/DB';

/**
 * Меню раздела Статистика
 */
function main(ctx: MyContext): Menu<InlineKeyboard> {
    const sendoutName = ctx.session.sendout?.name;

    const text = [
        ctx.t("modules.shared.sendout.view.sendout.statistic.main.title"),
        ctx.t("modules.shared.sendout.view.sendout.statistic.main.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.shared.sendout.view.sendout.statistic.main.buttons.selective"), `selectiveStatistic:${sendoutName}`)
        .text(ctx.t("modules.shared.sendout.view.sendout.statistic.main.buttons.comparative"), `comparativeStatistic:${sendoutName}`).row()
        .text(ctx.t("utils.shared.buttons.back"), `viewSendout:${sendoutName}`)
    ;
    return { text: utils.formatting.escapeMarkdown(text), keyboard }

}

function selective(ctx: MyContext): Menu<InlineKeyboard> {
    const text = [
        ctx.t("modules.shared.sendout.view.sendout.statistic.selective.main.title"),
        ctx.t("modules.shared.sendout.view.sendout.statistic.selective.main.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n\n');

    // Создаем экземпляр с параметрами (все опционально)
    const calendar = new CalendarKeyboard({
        minDate: new Date(constants.calendar.minDate),      // Минимальная дата для выбора
        maxDate: new Date(constants.calendar.maxDate),      // Максимальная дата
        startWeekDay: 1,                      // 1 = Пн, 0 = Вс
        locale: ctx.from?.language_code!, // Динамический язык из контекста
    });

    const keyboard = 
        calendar.generate(new Date(), ctx.from?.id!)
        .row().text(ctx.t("utils.shared.buttons.back"), `mainStatistic:${ctx.session.sendout.name}`)
    ;

    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

function targetDateOnCalendar(ctx: MyContext, result: Result): Menu<InlineKeyboard> {
    const text = [
        ctx.t(`shared.sendout.view.sendout.statistic.selective.targetDate.title`, { date: result.date, time: result.time, success: result.success }),
        ctx.t(`shared.sendout.view.sendout.statistic.selective.targetDate.path`, { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n\n');

    const keyboard = new InlineKeyboard();
    if (ctx.session.isAdmin) keyboard.text(ctx.t("modules.shared.sendout.view.sendout.statistic.selective.targetDate.buttonChat"), `viewChats:${ctx.session.sendout.name}-${result.date}`);
    keyboard.text(ctx.t("utils.shared.buttons.back"), `comparativeStatistic:${ctx.session.sendout.name}`);

    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

function comparative(ctx: MyContext): Menu<InlineKeyboard> {
    const sendoutName = ctx.session.sendout.name;

    const text = [
        ctx.t("modules.shared.sendout.view.sendout.statistic.comparative.main.title"),
        ctx.t("modules.shared.sendout.view.sendout.statistic.comparative.main.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.shared.sendout.view.sendout.statistic.comparative.main.buttons.week"), `comparativeStatistic:${sendoutName}-week`)
        .text(ctx.t("modules.shared.sendout.view.sendout.statistic.comparative.main.buttons.month"), `comparativeStatistic:${sendoutName}-month`).row()
        .text(ctx.t("utils.shared.buttons.back"), `mainStatistic:${ctx.session.sendout.name}`)
    ;
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

function handlerComparative(ctx: MyContext, type: StatisticType): Menu<InlineKeyboard> {
    const text = [
        ctx.t(`shared.sendout.view.sendout.statistic.comparative.${type}.title`),
        ctx.t(`shared.sendout.view.sendout.statistic.comparative.${type}.path`, { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `comparativeStatistic:${ctx.session.sendout.name}`);    
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

export default {
    main,
    selective,
    comparative,
    handlerComparative,
    targetDateOnCalendar
}