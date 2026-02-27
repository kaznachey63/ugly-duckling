declare module 'telegram-inline-calendar' {
    import { Bot } from 'grammy';

    interface CalendarOptions {
        // --- ОСНОВНЫЕ НАСТРОЙКИ ---
        bot_api?: 'grammy' | 'node-telegram-bot-api' | 'telegraf' | 'telebot';
        language?: 'ru' | 'en' | 'uk' | string;
        date_format?: string; // 'DD-MM-YYYY', 'YYYY-MM-DD' и т.д.

        // --- ДИАПАЗОН ДАТ ---
        start_date?: string | 'now'; // 'YYYY-MM-DD' или 'now'
        stop_date?: string | 'now';  // 'YYYY-MM-DD' или 'now'

        // ❌ УДАЛЕНО: startYear, minDate, maxDate (не существуют в библиотеке)

        // --- ДНИ НЕДЕЛИ ---
        start_week_day?: number; // 0=Воскресенье, 1=Понедельник
        // ❌ УДАЛЕНО: week_start_day, ignoreDays, disabledDatesFunc (не существуют)

        // --- ВРЕМЯ ---
        time_selector_mod?: boolean; // true = включить выбор времени
        time_range?: string;         // "09:00-18:00"
        time_step?: string;          // "30m" (строка с единицей измерения!)
        // ❌ УДАЛЕНО: timePicker, timeRange, timeStep (неправильные названия)

        // --- ПОВЕДЕНИЕ UI ---
        close_calendar?: boolean;    // Автозакрытие после выбора
        user_lang_select?: boolean;  // Выбор языка пользователем
        skip_years?: number | false; // Пропуск лет (если > 1)
        lock_date?: boolean;         // Блокировка дат
        lock_datetime?: boolean;     // Блокировка времени
        custom_start_msg?: string;   // Свой текст приветствия
        // ❌ УДАЛЕНО: multiple_mode, custom_buttons (не существуют)

        [key: string]: any;
    }

    class Calendar {
        constructor(bot: any, options?: CalendarOptions);

        // ✅ МЕТОДЫ
        startNavCalendar(ctx: any): Promise<void>;
        clickButtonCalendar(ctx: any): any; // Возвращает дату или -1
        getCalendarMarkup(): any;
        chats: Map<any, any>;
    }

    export { Calendar };
}