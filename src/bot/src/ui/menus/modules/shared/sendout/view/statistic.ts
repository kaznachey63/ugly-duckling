import type { MyContext } from '@shared/types/SessionData';
import { InlineKeyboard } from "grammy";
import type { Menu } from "@shared/types/Menu";
import type { StatisticType } from '@shared/types/StatisticType';
import utils from '@utils';
import { CalendarKeyboard } from 'src/ui/calendar';
import constants from '@constants';
import type { Chat, Result } from '@shared/types/DB';

/**
 * Меню раздела Статистика
 */
function main(ctx: MyContext): Menu<InlineKeyboard> {
    const sendoutId = ctx.session.sendout?.id;

    const text = [
        ctx.t("modules.shared.sendout.view.sendout.statistic.main.title"),
        ctx.t("modules.shared.sendout.view.sendout.statistic.main.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n\n');
    
    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.shared.sendout.view.sendout.statistic.main.buttons.selective"), `selectiveStatistic:${sendoutId}`)
        .text(ctx.t("modules.shared.sendout.view.sendout.statistic.main.buttons.comparative"), `comparativeStatistic:${sendoutId}`).row()
        .text(ctx.t("utils.shared.buttons.back"), `viewSendout:${sendoutId}`)
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
        .row().text(ctx.t("utils.shared.buttons.back"), `mainStatistic:${ctx.session.sendout.id}`)
    ;

    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

function targetDateOnCalendar(ctx: MyContext): Menu<InlineKeyboard> {
    const date = ctx.session.result.date_time?.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }); 
    const time = ctx.session.result.date_time?.toISOString().split('T')[1]!.slice(0, 5);

    const text = [
        ctx.t(`modules.shared.sendout.view.sendout.statistic.selective.targetDate.main.title`, { date: date }),
        ctx.t(`modules.shared.sendout.view.sendout.statistic.selective.targetDate.main.time`, { time: time }),
        ctx.t(`modules.shared.sendout.view.sendout.statistic.selective.targetDate.main.success`, { success: ctx.session.result.success }),
        '',
        ctx.t(`modules.shared.sendout.view.sendout.statistic.selective.targetDate.main.path`, { 
            call: ctx.session.sendout.call, 
            menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet"),
            date: date
        })
    ].join('\n');

    const keyboard = new InlineKeyboard();
    if (ctx.session.isAdmin) keyboard.text(ctx.t("utils.shared.buttons.chats"), `viewChats:${ctx.session.sendout.id}#${ctx.session.result.id}`).row();
    keyboard.text(ctx.t("utils.shared.buttons.back"), `selectiveStatistic:${ctx.session.sendout.id}`);

    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

/**
 * Просмотр чатов за результат рассылки
 */

function chats(ctx: MyContext): Menu<InlineKeyboard> {
    const dateBase = ctx.session.result.date_time?.toISOString().split('T')[0]?.replace(/:/g, '-');
    const date = ctx.session.result.date_time?.toLocaleDateString('ru-RU', {
        day: '2-digit', 
        month: '2-digit',
        year: 'numeric'
    }); 

    const text = [
        ctx.t("utils.shared.titles.amount", { amount: ctx.session.result.success }),
        ctx.t("modules.shared.sendout.view.sendout.statistic.selective.targetDate.chats.path", { 
            call: ctx.session.sendout.call, 
            menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet"),
            date: date
        })
    ].join('\n\n');

    const keyboard = new InlineKeyboard();
    (ctx.session.result.chats as Chat[]).forEach((chat: Chat) => {
        keyboard.url(chat.title!, chat.link!).row();
    });

    keyboard.text(ctx.t("utils.shared.buttons.back"), `calendar:date:${dateBase}`);

    return { text: utils.formatting.escapeMarkdown(text), keyboard };
}

function prev(ctx: MyContext): InlineKeyboard {
    const userId = ctx.from!.id;
    const current = CalendarKeyboard.getDisplayMonth(userId) ?? new Date();
    const newDate = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    CalendarKeyboard.updateCurrentMonth(userId, newDate);

    const calendar = new CalendarKeyboard({
        minDate: new Date(constants.calendar.minDate),
        maxDate: new Date(constants.calendar.maxDate),
        startWeekDay: 1,
        locale: ctx.session.user.language ?? 'ru'
    });

    return calendar.generate(newDate, userId)
    .row().text(ctx.t("utils.shared.buttons.back"), `mainStatistic:${ctx.session.sendout.id}`);
}

function next(ctx: MyContext): InlineKeyboard {
    const userId = ctx.from!.id;
    const current = CalendarKeyboard.getDisplayMonth(userId) ?? new Date();
    const newDate = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    CalendarKeyboard.updateCurrentMonth(userId, newDate);

    const calendar = new CalendarKeyboard({
        minDate: new Date(constants.calendar.minDate),
        maxDate: new Date(constants.calendar.maxDate),
        startWeekDay: 1,
        locale: ctx.session.user.language ?? 'ru'
    });

    return calendar.generate(newDate, userId)
    .row().text(ctx.t("utils.shared.buttons.back"), `mainStatistic:${ctx.session.sendout.id}`);
}

function comparative(ctx: MyContext): Menu<InlineKeyboard> {
    const sendoutId = ctx.session.sendout.id;

    const text = [
        ctx.t("modules.shared.sendout.view.sendout.statistic.comparative.main.title"),
        ctx.t("modules.shared.sendout.view.sendout.statistic.comparative.main.path", { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n\n');

    const keyboard = new InlineKeyboard()
        .text(ctx.t("modules.shared.sendout.view.sendout.statistic.comparative.main.buttons.week"), `comparativeStatistic:${sendoutId}-week`)
        .text(ctx.t("modules.shared.sendout.view.sendout.statistic.comparative.main.buttons.month"), `comparativeStatistic:${sendoutId}-month`).row()
        .text(ctx.t("utils.shared.buttons.back"), `mainStatistic:${sendoutId}`)
    ;
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

function handlerComparative(ctx: MyContext, type: StatisticType): Menu<InlineKeyboard> {
    const text = [
        ctx.t(`shared.sendout.view.sendout.statistic.comparative.${type}.title`),
        ctx.t(`shared.sendout.view.sendout.statistic.comparative.${type}.path`, { call: ctx.session.sendout.call, menu: ctx.session.isAdmin ? ctx.t("utils.shared.titles.panel") : ctx.t("utils.shared.titles.cabinet") })
    ].join('\n\n');

    const keyboard = new InlineKeyboard().text(ctx.t("utils.shared.buttons.back"), `comparativeStatistic:${ctx.session.sendout.id}`);    
    return { text: utils.formatting.escapeMarkdown(text), keyboard }
}

export default {
    main,
    selective,
    comparative,
    handlerComparative,
    targetDateOnCalendar,
    chats,
    prev,
    next
}