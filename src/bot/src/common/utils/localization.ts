import type { LanguageCode } from 'grammy/types';
import map from '../maps';
import type { RoleCode } from '@shared/types/RoleCode';
import type { LanguagesALlowed } from '@shared/types/LanguagesAllowed';
import type { MyContext } from '@shared/types/SessionData';

/**
 * Преобразует один объект Time в человекочитаемую строку
 * @returns строка вида "Вторник - 12:30"
 */ 
function formatTimeToRu(ctx: MyContext, cronTime: string): string | null {
    const [minute, hour, day, month, weekDay] = cronTime.split(' ');

    if (!minute || !hour || day === undefined || month === undefined || weekDay === undefined) {
        return null;
    }

    const formattedHour = String(hour).padStart(2, '0');
    const formattedMinute = String(minute).padStart(2, '0');
    const time = `${formattedHour}:${formattedMinute}`;

    // Конкретная дата
    if (day !== '*' && month !== '*') {
        return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')} - ${time}`;
    }

    // День месяца
    if (day !== '*' && month === '*') {
        return `${day} ${ctx.t("utils.localization.schedule.number")} - ${time}`;
    }

    // День недели
    if (weekDay !== '*') {
        return `${map.dayWeekMap[weekDay] ?? ctx.t("utils.localization.schedule.unknownDay")} - ${time}`;
    }

    // Каждый день
    return `${ctx.t("utils.localization.schedule.everyDay")} - ${time}`;
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

function getRoleId(roleCode: RoleCode): number {
    return map.roleCodes[roleCode]!;
}

function getRoleCode(roleId: number): RoleCode {
    return map.rolesIds[roleId]!;
}

function getContryFlagOfCode(countryCode: LanguagesALlowed) {
    return map.countryFlags[countryCode]!;
}

export default {
    formatTimeToRu,
    checkMediaInDocument,
    getMediaFormat,
    isSupportedMediaType,
    getRoleId,
    getRoleCode,
    getContryFlagOfCode,
};