import type { MyContext } from "@shared/types/SessionData";

function getCalendar(ctx: MyContext) {
    const calendar = new Calendar(ctx as any, {
        bot_api: 'grammy',
        language: "ru",
        date_format: "DD-MM-YYYY",
        start_week_day: 1,
        time_selector_mod: false,
        start_date: '2025-12-01',
        stop_date: '2026-12-31',
        close_calendar: true,
    });
    // Возвращаем клавиатуру календаря
    return calendar.getCalendarMarkup();
}

export default {
    getCalendar
}