import { DateTime } from 'luxon';

/**
 * Метод преобразования времени из крон-формата в человекоподобный формат
 * @param cronTime Время в крон-формате
 * @returns Время в человекоподобном формате
 */
function formatCronTime(cronTime: string): string {
    const [minute, hour] = cronTime.split(" ");
    // Проверяем, что hour и minute определены
    if (!hour || !minute) {
        throw new Error(`Неверный формат cron-времени: ${cronTime}`);
    }
    return DateTime.fromObject({ hour: parseInt(hour), minute: parseInt(minute) }).toFormat("HH:mm");
}

export default {
    formatCronTime
}