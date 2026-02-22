import type { TelegramError } from "@shared/types/TelegramError";

/** 
 * Метод-обработчик ошибок при отправке сообщения
 * @param error Содержание ошибки
 * @returns Обозначение ошибки
 */
function errorSmsHandler(error: TelegramError): string {
    const codeError = error.code;
    // Безопасно получаем сообщение из разных источников
    const messageError = error.message || (error as any).errorMessage || '';

    switch (codeError) {
        case 400: {
            if (messageError.includes("USER_BANNED_IN_CHANNEL"))
                return "забанен в чате";
            if (messageError.includes("CHANNEL_INVALID") || messageError.includes("Could not find the input entity"))
                return "канал недоступен";
            if (messageError.includes("CHAT_SEND_PHOTOS_FORBIDDEN"))
                return "запрещено отправлять фото";
            if (messageError.includes("FLOOD_WAIT")) {
                const match = messageError.match(/FLOOD_WAIT_(\d+)/);
                const seconds = match ? match[1] : 'несколько';
                return `лимит отправки (${seconds} сек)`;
            }
            return "ошибка 400";
        }

        case 403: {
            if (messageError.includes("CHAT_WRITE_FORBIDDEN"))
                return "запрещено писать в чат";
            if (messageError.includes("CHAT_SEND_PHOTOS_FORBIDDEN"))
                return "запрещено отправлять фото";
            return "ошибка 403";
        }

        default: {
            if (messageError.includes("Connection") || messageError.includes("timeout") || messageError.includes("Not connected"))
                return "проблема с подключением";
            return "неизвестная ошибка";
        }
    }
}

export default {
    errorSmsHandler
}