const typeComparativeStatistika = {
    "week": "Неделя",
    "month": "Месяц"
};

const fileFormat = {
    "image": ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "tiff", "ico"],
    "video": ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm", "m4v", "3gp", "mpeg", "mpg"]
};

const mimeType = {
    "image": ["jpeg", "png", "gif", "bmp", "webp", "svg+xml", "tiff", "x-icon"],
    "video": ["mp4", "x-msvideo", "quicktime", "x-ms-wmv", "x-flv", "x-matroska", "webm", "x-m4v", "3gpp", "mpeg"]
};

const dayWeekMap = {
    '1': 'Понедельник',
    '2': 'Вторник',
    '3': 'Среда',
    '4': 'Четверг',
    '5': 'Пятница',
    '6': 'Суббота',
    '7': 'Воскресенье',
    '*': 'Каждый день'
};

export default {
    typeComparativeStatistika,
    fileFormat,
    mimeType,
    dayWeekMap,
};