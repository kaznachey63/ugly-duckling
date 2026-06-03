import type { LanguagesALlowed } from "@shared/types/LanguagesAllowed"
import type { RoleCode } from "@shared/types/RoleCode"
const shared = {
    utf8: 'utf8',
};

const link = {
    form: "https://forms.gle/i91r3EaCeigbuo479",
    tgAdmin: "https://t.me/master_cuni",
    ideasChat: "https://t.me/c/3760118458/81/",
    profileById: "tg://user?id=",
    chatByNumber: "https://t.me/+",
    instruction: {
        commands: "https://telegra.ph/Komandy-Rassylka-bot-11-29-2",
        service: "",
        time: {
            add: "https://telegra.ph/Dobavlenie-vremeni-06-03"
        },
        user: {
            add: "https://telegra.ph/Dobavlenie-polzovatelya-06-02",
        },
        media: {
            add: "https://telegra.ph/Dobavlenie-mediafajlov-06-03",
        },
        contract: { 
            add: "https://telegra.ph/Dobavlenie-dogovora-06-03",
        },
        text: {
            add: {
                hand: "https://telegra.ph/Dobavlenie-soobshcheniya-teksta-vruchnuyu-06-03",
                giga: "https://telegra.ph/Dobavlenie-soobshcheniya-teksta-s-pomoshchyu-Nejroseti-06-03",
            },
        },
    },
}

const calendar = {
    minDate: '1970-01-01',
    maxDate: '2100-12-31'
}

const google = {
    rangeTable: "Заказчики!A2:I",
    scopeForAuth: "https://www.googleapis.com/auth/spreadsheets",
}

const gigaChat = {
    systemPrompt:
        `Выдавай ТОЛЬКО текст. БЕЗ ПУСТЫХ СТРОК. БЕЗ ПРИВЕТСТВИЙ.
        АЛГОРИТМ:
        Первая строка: Напиши **📍 [ЖК и адрес]** (Жирным всю строку)
        Блок характеристик: Каждое слово из текста — С НОВОЙ СТРОКИ. Каждая строка ОБЯЗАТЕЛЬНО начинается с - (дефис и пробел). ЗАПРЕЩЕНО писать две характеристики в одну строку.
        Строка цены: Напиши **💰 [Цена]** (Жирным всю строку)
        Строка агента: Напиши 📞 **[Имя]**: [номер] (Жирным только имя)
        ЖЕСТКИЕ ТРЕБОВАНИЯ:
        НИКАКИХ пустых строк между пунктами (слитный список)
        НИКАКИХ запятых (вместо запятой — новая строка и дефис)
        НИКАКИХ слов "скидка", если их нет в тексте
        ОБЯЗАТЕЛЬНО подписывай что это (Метраж, Этаж, Вид), если это есть в оригинале
        ОБРАЗЕЦ:
        📍 ЖК Курортный, Адлер, ул. Ленина, корп. 18
        Площадь: 50 м²
        Отделка: Черновая
        Этаж: 2
        Вид: На море
        💰 12 млн (1 млн)
        📞 Илья: +79881487726
        ТЕКСТ:\n`.trim()
    ,
    maxTokens: 150,
    temperature: 0.15,
    timeout: 60
}

const media = {
    maxSizeFile: 20 * 1024 * 1024, // 20 МБ
    maxMedia: 4,
    maxCharsCaption: 1024
}

const server = {
    timeout: 30
}

const chart = {
    datalabels: {
        color: '#fff',
        backgroundColor: 'rgba(34, 139, 34, 0.6)',
        borderColor: 'rgba(34, 139, 34, 1)',
        borderWidth: 1,
        borderRadius: 5,
    },
    dataset: {
        borderWidth: 2,
        tensionWeek: 0,
        tensionMonth: 0.35,
        pointRadiusMonth: 2,
        backgroundColorBar: 'rgba(54, 162, 235, 0.7)',
        borderColorLine: 'rgba(54, 162, 235, 1)',
    },
    axis: {
        yMin: 0,
        yMax: 45,
        stepSize: 10,
        fontSize: 14,
    },
    canvas: {
        week: { width: 900, height: 450 },
        month: { width: 1200, height: 600 },
    },

    backgroundColor: 'white',
}

const adminData = {
    phone: "79371807522"
}

const allowLanguages: LanguagesALlowed[] = [
    'ru', 'en', 'zh', 'sr', 'es', 'hi', 'ar', 'fr', 'pt', 'ja', 'de', 'it', 'ko', 'tr', 'pl', 'nl', 'el', 'cs', 'ro', 'hu', 'bg', 'sk', 'hr', 'sl', 'vi', 'th', 'id', 'fa', 'bn', 'kk', 'sv', 'ms', 
];

const roles: RoleCode[] = [
    "admin", "customer", "unknown"
];

const ids = {
    generalChatId: "-1003760118458",
    ideaChatId: 81
};

const message = {
    maxCharsWithoutPremium: 4096,
    maxCharsWithPremium: 32768,
}

const price = {
    days30: 2000
};

const priceText = {
    1: "две тысячи рублей",
    2: "четыре тысячи рублей",
    3: "шесть тысяч рублей",
    4: "восемь тысяч рублей",
    5: "десять тысяч рублей",
};

const crypto = {
    key: process.env.CRYPTO_KEY,
    salt: process.env.CRYPTO_SALT,
    cipherAlgorithm: 'aes-256-ctr',
    hex: 'hex',
    hashAlgorithm: 'sha256',
    ivLength: 16
};

const limit = {
    authMaxAttempts: 3,
    commandsTime: 1500
};

const emoji = {
    profile: '🥷'
};

export default {
    shared,
    link,
    calendar,
    google,
    gigaChat,
    media,
    chart,
    server,
    adminData,
    allowLanguages,
    roles,
    ids,
    message,
    price,
    priceText,
    crypto,
    limit,
    emoji,
}