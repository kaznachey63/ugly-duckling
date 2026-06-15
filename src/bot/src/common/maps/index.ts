import type { RoleCode } from "@shared/types/RoleCode";
import type { LanguagesALlowed } from "@shared/types/LanguagesAllowed";

const fileFormat: Record<string, string[]> = {
    "image": ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "tiff", "ico"],
    "video": ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm", "m4v", "3gp", "mpeg", "mpg"]
};

const mimeType: Record<string, string[]> = {
    "image": ["jpeg", "png", "gif", "bmp", "webp", "svg+xml", "tiff", "x-icon"],
    "video": ["mp4", "x-msvideo", "quicktime", "x-ms-wmv", "x-flv", "x-matroska", "webm", "x-m4v", "3gpp", "mpeg"]
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

const countryFlags: Record<LanguagesALlowed, string> = {
    "af": "🇿🇦", // африкаанс
    "am": "🇪🇹", // амхарский
    "ar": "🇸🇦", // арабский
    "az": "🇦🇿", // азербайджанский
    "be": "🇧🇾", // белорусский
    "bg": "🇧🇬", // болгарский
    "bn": "🇧🇩", // бенгальский
    "ca": "🇦🇩", // каталанский
    "cs": "🇨🇿", // чешский
    "da": "🇩🇰", // датский
    "de": "🇩🇪", // немецкий
    "el": "🇬🇷", // греческий
    "en": "🇺🇸", // английский
    "es": "🇪🇸", // испанский
    "et": "🇪🇪", // эстонский
    "fa": "🇮🇷", // персидский
    "fi": "🇫🇮", // финский
    "fr": "🇫🇷", // французский
    "he": "🇮🇱", // иврит
    "hi": "🇮🇳", // хинди
    "hr": "🇭🇷", // хорватский
    "hu": "🇭🇺", // венгерский
    "hy": "🇦🇲", // армянский
    "id": "🇮🇩", // индонезийский
    "it": "🇮🇹", // итальянский
    "ja": "🇯🇵", // японский
    "ka": "🇬🇪", // грузинский
    "kk": "🇰🇿", // казахский
    "km": "🇰🇭", // кхмерский
    "ko": "🇰🇷", // корейский
    "ky": "🇰🇬", // киргизский
    "lo": "🇱🇦", // лаосский
    "lt": "🇱🇹", // литовский
    "lv": "🇱🇻", // латышский
    "mn": "🇲🇳", // монгольский
    "ms": "🇲🇾", // малайский
    "my": "🇲🇲", // бирманский
    "nl": "🇳🇱", // нидерландский
    "no": "🇳🇴", // норвежский
    "pl": "🇵🇱", // польский
    "pt": "🇵🇹", // португальский
    "ro": "🇷🇴", // румынский
    "ru": "🇷🇺", // русский
    "sk": "🇸🇰", // словацкий
    "sl": "🇸🇮", // словенский
    "sr": "🇷🇸", // сербский
    "sv": "🇸🇪", // шведский
    "sw": "🇹🇿", // суахили (флаг Танзании)
    "th": "🇹🇭", // тайский
    "tl": "🇵🇭", // тагальский (филиппинский)
    "tr": "🇹🇷", // турецкий
    "uk": "🇺🇦", // украинский
    "ur": "🇵🇰", // урду
    "uz": "🇺🇿", // узбекский
    "vi": "🇻🇳", // вьетнамский
    "zh": "🇨🇳", // китайский
};

export default {
    fileFormat,
    mimeType,
    roleCodes,
    rolesIds,
    countryFlags,
};