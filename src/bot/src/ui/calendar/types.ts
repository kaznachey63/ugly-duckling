export interface CalendarOptions {
    minDate?: Date;
    maxDate?: Date;
    startWeekDay?: 0 | 1; // 0 = Sunday, 1 = Monday (default)
    locale?: string;      // для i18next, default 'ru'
}

export interface CalendarState {
    currentMonth: Date;
    returnToMonth?: Date; // ✅ просто опциональное поле, без null
}

export type CalendarAction = 'date' | 'prev' | 'next' | 'ignore';
export type CalendarCallbackData = `calendar:${CalendarAction}:${string}`;