import type { MyContext, SessionData } from '@shared/types/SessionData';
import map from '../maps';

/**
 * Проверяет текст, на потребность его отформатировать в MD формате
 * @param ctx контекст
 * @returns Текст, о ненайденном типе или true, если параметр entities оказался пустым
 */
function checkMD(ctxMessage: any): true | string {
    const userEntities = 'entities' in ctxMessage! ? ctxMessage.entities : null;
    if (!userEntities || userEntities.length === 0) {
        return true;
    }

    for (const { type } of userEntities) {
        if (!getTypeMD(type) && type != "phone_number" && type != "hashtag") {
            return "Использованы неподдерживаемые типы форматирования! Попробуйте снова";
        }
    }

    return true;
}

/**
 * Получение символа для форматирования по MD из названия типа форматирования
 * @param type Название типа форматирования
 * @returns Символ по названию форматирования
 */
function getTypeMD(type: string): string {
    return map.markdown[type]!;
}

/**
 * Вставляет необходимые параметры форматирования MD в сообщение
 * @param ctx Контекст
 * @returns Если нет форматирования в тексте - вернет обычный текст, иначе - текст ф форматированием
 */
function setMD(ctx: MyContext): string {
    const userEntities = 'entities' in ctx.message! ? ctx.message.entities : null;
    const text = ctx.text ?? '';

    // Если нет entities — просто верни текст
    if (!userEntities || userEntities.length === 0 || text == '') {
        return text.trim();
    }

    const chars = text.split('');

    const sortedEntities = [...userEntities].sort((a, b) => {
        return (b.offset + b.length) - (a.offset + a.length);
    });

    for (const { offset, length, type } of sortedEntities) {
        const md = getTypeMD(type);
        chars.splice(offset + length, 0, md);
        chars.splice(offset, 0, md);
    }

    return chars.join('');
}

function escapeMarkdown(text: string): string {
    return text.replace(/([_[\]()~>#+\-=|{}.!\\])/g, '\\$1');
}

export default {
    checkMD,
    setMD,
    escapeMarkdown
}