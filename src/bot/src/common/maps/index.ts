type MapConstants = {
    dayWeekMap: Record<string, string>;
    markdown: Record<string, string>;
    fileFormat: Record<string, string[]>;
    mimeType: Record<string, string[]>;
    typeComparativeStatistika: Record<string, string>;
    months: Record<string, string>;
    monthNumbers: Record<string, string>;
};

const maps: MapConstants = {
    months: {
        "Jan": "Янв",
        "Feb": "Фев",
        "Mar": "Мар",
        "Apr": "Апр",
        "May": "Май",
        "Jun": "Июн",
        "Jul": "Июл",
        "Aug": "Авг",
        "Sep": "Сен",
        "Oct": "Окт",
        "Nov": "Ноя",
        "Dec": "Дек"
    },
    monthNumbers: {
        "Jan": "1",
        "Feb": "2",
        "Mar": "3",
        "Apr": "4",
        "May": "5",
        "Jun": "6",
        "Jul": "7",
        "Aug": "8",
        "Sep": "9",
        "Oct": "10",
        "Nov": "11",
        "Dec": "12"
    },
    typeComparativeStatistika: {
        "week": "Неделя",
        "month": "Месяц"
    },
    fileFormat: {
        "image": ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "tiff", "ico"],
        "video": ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm", "m4v", "3gp", "mpeg", "mpg"]
    },

    mimeType: {
        "image": ["jpeg", "png", "gif", "bmp", "webp", "svg+xml", "tiff", "x-icon"],
        "video": ["mp4", "x-msvideo", "quicktime", "x-ms-wmv", "x-flv", "x-matroska", "webm", "x-m4v", "3gpp", "mpeg"]
    },

    dayWeekMap:  {
        '1': 'Понедельник',
        '2': 'Вторник',
        '3': 'Среда',
        '4': 'Четверг',
        '5': 'Пятница',
        '6': 'Суббота',
        '7': 'Воскресенье',
        '*': 'Каждый день'
    },
    
    markdown: {
        bold: "**",
        italic: "__",
        strikethrough: "~~",
        spoiler: "||"
    }
}; 

export default maps;