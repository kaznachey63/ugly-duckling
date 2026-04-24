import type { RoleCode } from "@shared/types/RoleCode";

const typeComparativeStatistika: Record<string, string> = {
    "week": "Неделя",
    "month": "Месяц"
};

// Ключи — string, потому что typeMedia приходит из runtime-данных
const fileFormat: Record<string, string[]> = {
    "image": ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "tiff", "ico"],
    "video": ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm", "m4v", "3gp", "mpeg", "mpg"]
};

const mimeType: Record<string, string[]> = {
    "image": ["jpeg", "png", "gif", "bmp", "webp", "svg+xml", "tiff", "x-icon"],
    "video": ["mp4", "x-msvideo", "quicktime", "x-ms-wmv", "x-flv", "x-matroska", "webm", "x-m4v", "3gpp", "mpeg"]
};

const dayWeekMap: Record<string, string> = {
    '1': 'Понедельник',
    '2': 'Вторник',
    '3': 'Среда',
    '4': 'Четверг',
    '5': 'Пятница',
    '6': 'Суббота',
    '7': 'Воскресенье',
    '*': 'Каждый день'
};

const roleCodes: Record<RoleCode, number> = {
    "admin": 1,
    "customer": 2,
    "unknown": 3
};

const rolesIds: Record<number, RoleCode> = {
    1: "admin",
    2: "customer",
    3: "unknown"
};

export default {
    typeComparativeStatistika,
    fileFormat,
    mimeType,
    dayWeekMap,
    roleCodes,
    rolesIds
};