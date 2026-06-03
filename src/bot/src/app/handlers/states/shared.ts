function validateText(text: string): boolean {
    if (typeof text !== 'string' || text.trim().length === 0) {
        return false;
    }

    const trimmed = text.trim();
    const urlPattern = /(?:https?:\/\/|www\.|t\.me\/)[^\s]+/i;
    const usernamePattern = /@[a-zA-Z0-9_\u0400-\u04FF]{3,32}(?!\w)/;

    if (urlPattern.test(trimmed)) return false; 
    if (usernamePattern.test(trimmed)) return false;

    return true;
}

export function validateTime(time: string): boolean {
    const clean = time
        .replace(/\u200B/g, '')
        .replace(/\uFEFF/g, '')
        .replace(/\t/g, ' ')
        .trim();

    const parts = clean.split(/\s+/).filter(Boolean);

    // Строго 5 полей в одной строке
    if (parts.length !== 5) return false;

    const [minute, hour, day, month, weekDay] = parts;

    if (!/^\d+$/.test(minute!) || !/^\d+$/.test(hour!)) return false;

    const m = Number(minute);
    const h = Number(hour);

    if (m < 0 || m > 59 || h < 0 || h > 23) return false;

    const isValid = (v: string) => v === '*' || /^\d+$/.test(v);

    return [day, month, weekDay].every(isValid);
}

export function formatCronTime(time: string): string {
    const parts = time.trim().split(/\s+/).filter(Boolean);
    
    const [minute, hour, day, month, weekDay] = parts;

    return [
        minute!.padStart(2, '0'),
        hour!.padStart(2, '0'),
        day,
        month,
        weekDay
    ].join(' ');
}

function validatePhone(phone: string): boolean {
    return (!isNaN(Number(phone)) && phone.length === 11);
}

export default {
    validateText,
    validateTime,
    formatCronTime,
    validatePhone,
}