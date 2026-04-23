import map from '../maps';

/**
 * Преобразует один объект Time в человекочитаемую строку
 * @param time объект Time из базы данных
 * @param index опциональный номер элемента для отображения (например, 1.)
 * @returns строка вида "Вторник - 12:30" или "1. Вторник - 12:30"
 */ 
function formatTimeToRu(cronTime: string, index?: number): string | null {
    const [ minute, hour, day, month, weekDay ] = cronTime.split(' ');

    // Проверяем наличие обязательных полей
    if (!minute || !hour || !weekDay) {
        console.warn(`Пропущены данные в записи`);
        return null;
    }

    // Получаем название дня недели
    const dayName = map.dayWeekMap[weekDay] || 'Неизвестный день';

    // Форматируем часы и минуты (добавляем ведущий ноль)
    const formattedHour = String(hour).padStart(2, '0');
    const formattedMinute = String(minute).padStart(2, '0');

    // Формируем итоговую строку
    const prefix = index !== undefined ? `${index}. ` : '';
    return `${prefix}${dayName} - ${formattedHour}:${formattedMinute}`;
}

/**
 * Проверка на соответсвие MimeType == медиа
 * @param mimeType MimeType
 * @returns True - если тип соответсвует медиа, false - нет
 */
function checkMediaInDocument(mimeType: string): boolean {
    const [typeMedia, typeExec] = mimeType.split('/');

    if (!typeMedia || !typeExec) return false;

    const allowedSubtypes = map.mimeType[typeMedia as keyof typeof map.mimeType];
    return allowedSubtypes ? allowedSubtypes.includes(typeExec) : false;
}

/**
 * Получение корректного расширения медиа
 * @param mimeType MimeType
 * @param mediaExec Расширение медиа
 * @returns Либо поддерживаемое расширение, либо расширение по умолчанию
 */
function getMediaFormat(mimeType: string, mediaExec: string): string {
    const typeMedia = mimeType.split('/')[0];
    if (!typeMedia) return "";

    const allowedExtensions = map.fileFormat[typeMedia]!; // массив расширений без точки

    // Проверяем, есть ли расширение в списке разрешённых
    if (allowedExtensions.includes(mediaExec)) {
        return '.' + mediaExec;
    }

    // Иначе — расширение по умолчанию
    return typeMedia === 'image' ? '.jpg' : '.mp4';
}

/**
 * Проверка на корректный тип медиа
 * @param contentType Тип медиа
 * @returns True - если передан корректный тип медиа, иначе - false
 */
function isSupportedMediaType(contentType: string): boolean {
    const [type, subtype] = contentType.split('/');
    return !!(type && subtype && map.mimeType[type]?.includes(subtype));
}

function getTypeCompStatRu(typeStatistika: string ) {
    return map.typeComparativeStatistika[typeStatistika]!;
}

export default {
    formatTimeToRu,
    checkMediaInDocument,
    getMediaFormat,
    isSupportedMediaType,
    getTypeCompStatRu,
};