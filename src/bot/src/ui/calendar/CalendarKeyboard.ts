import { InlineKeyboard } from 'grammy';
import i18next from 'i18next';
import type { CalendarOptions, CalendarState } from './types';
import constants from '@constants';

// Хранилище состояний: userId -> state
const calendarStates = new Map<number, CalendarState>();

export class CalendarKeyboard {
    private options: Required<CalendarOptions>;

    constructor(options: CalendarOptions = {}) {
        this.options = {
            minDate: options.minDate ?? new Date(constants.calendar.minDate),
            maxDate: options.maxDate ?? new Date(constants.calendar.maxDate),
            startWeekDay: options.startWeekDay ?? 1,
            locale: options.locale ?? 'ru',
        };
    }

    /**
     * Генерация клавиатуры календаря
     */
    generate(date: Date, userId: number): InlineKeyboard {
        // Инициализация состояния при первом открытии
        if (!calendarStates.has(userId)) {
            calendarStates.set(userId, {
                currentMonth: new Date(date.getFullYear(), date.getMonth(), 1),
            });
        }

        const state = calendarStates.get(userId)!;
        const displayDate = state.returnToMonth ?? state.currentMonth;

        const keyboard = new InlineKeyboard();

        // === Header: [<] Month Year [>] ===
        this.addHeaderRow(keyboard, displayDate);

        // === Week day names ===
        this.addWeekDaysRow(keyboard);

        // === Days grid ===
        this.addDaysGrid(keyboard, displayDate);

        return keyboard;
    }

    private addHeaderRow(keyboard: InlineKeyboard, date: Date): void {
        const t = i18next.getFixedT(this.options.locale);
        const monthName = t(`calendar.months.${date.getMonth()}`) ?? this.getDefaultMonthName(date.getMonth());
        const year = date.getFullYear();

        const prevDisabled = this.isBeforeMinMonth(date);
        const nextDisabled = this.isAfterMaxMonth(date);

        // Кнопка "Назад"
        if (prevDisabled) {
            keyboard.text('·', 'calendar:ignore:prev');
        } else {
            keyboard.text('‹', `calendar:prev:${CalendarKeyboard.toYyyymmdd(date)}`);
        }

        // Название месяца
        keyboard.text(`${monthName} ${year}`, 'calendar:ignore:month');

        // Кнопка "Вперёд"
        if (nextDisabled) {
            keyboard.text('·', 'calendar:ignore:next');
        } else {
            keyboard.text('›', `calendar:next:${CalendarKeyboard.toYyyymmdd(date)}`);
        }

        keyboard.row(); // завершаем строку хедера
    }

    private addWeekDaysRow(keyboard: InlineKeyboard): void {
        const weekDays = this.getWeekDayNames();
        for (const day of weekDays) {
            keyboard.text(day, 'calendar:ignore:weekday');
        }
        keyboard.row();
    }

    private addDaysGrid(keyboard: InlineKeyboard, date: Date): void {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Сдвиг первого дня недели
        let startOffset = firstDay.getDay() - this.options.startWeekDay;
        if (startOffset < 0) startOffset += 7;

        let currentColumn = 0;

        // Пустые ячейки до первого дня
        for (let i = 0; i < startOffset; i++) {
            keyboard.text(' ', 'calendar:ignore:empty');
            currentColumn++;
        }

        // Дни месяца
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const currentDate = new Date(year, month, day);
            const isToday = currentDate.getTime() === today.getTime();
            const isInRange = this.isDateInRange(currentDate);

            const displayText = isToday ? `[${day}]` : day.toString();
            const callbackData = isInRange
                ? `calendar:date:${CalendarKeyboard.toYyyymmdd(currentDate)}`
                : `calendar:ignore:disabled-${day}`;

            keyboard.text(displayText, callbackData);
            currentColumn++;

            // Новая строка каждые 7 кнопок
            if (currentColumn === 7) {
                keyboard.row();
                currentColumn = 0;
            }
        }

        // Заполнение конца последней недели + завершение строки
        if (currentColumn > 0) {
            while (currentColumn < 7) {
                keyboard.text(' ', 'calendar:ignore:empty');
                currentColumn++;
            }
            keyboard.row();
        }
    }

    private isDateInRange(date: Date): boolean {
        const time = date.getTime();
        return time >= this.options.minDate.getTime() && time <= this.options.maxDate.getTime();
    }

    private isBeforeMinMonth(date: Date): boolean {
        const min = this.options.minDate;
        return (
            date.getFullYear() < min.getFullYear() ||
            (date.getFullYear() === min.getFullYear() && date.getMonth() <= min.getMonth())
        );
    }

    private isAfterMaxMonth(date: Date): boolean {
        const max = this.options.maxDate;
        return (
            date.getFullYear() > max.getFullYear() ||
            (date.getFullYear() === max.getFullYear() && date.getMonth() >= max.getMonth())
        );
    }

    private getWeekDayNames(): string[] {
        const t = i18next.getFixedT(this.options.locale);
        const defaultNames =
            this.options.startWeekDay === 1
                ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
                : ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

        return defaultNames.map((name, i) =>
            t(`calendar.days.${i}`) ?? name
        );
    }

    private getDefaultMonthName(monthIndex: number): string {
        const ru = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        const en = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return this.options.locale === 'en' ? en[monthIndex]! : ru[monthIndex]!;
    }

    static toYyyymmdd(date: Date): string {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    // === Управление состоянием ===

    static setReturnPoint(userId: number): void {
        const state = calendarStates.get(userId);
        if (state) {
            state.returnToMonth = new Date(state.currentMonth);
        }
    }

    static getDisplayMonth(userId: number): Date | undefined {
        const state = calendarStates.get(userId);
        return state?.returnToMonth ?? state?.currentMonth;
    }

    static clearReturnPoint(userId: number): void {
        const state = calendarStates.get(userId);
        if (state) {
            delete state.returnToMonth; // ✅ вместо undefined используем delete
        }
    }
    
    static updateCurrentMonth(userId: number, date: Date): void {
        const state = calendarStates.get(userId);
        if (state) {
            state.currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        }
    }

    static clearState(userId: number): void {
        calendarStates.delete(userId);
    }
}