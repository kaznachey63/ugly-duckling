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

function validateTime(time: string): boolean {
    const parts = time.trim().split(/\s+/);

    if (parts.length !== 5) return false;

    const [minute, hour, day, month, weekDay] = parts;

    const isNum = (v: string) => /^\d+$/.test(v);

    if (
        !isNum(minute!) || +minute! < 0 || +minute! > 59 ||
        !isNum(hour!) || +hour! < 0 || +hour! > 23
    ) {
        return false;
    }

    return [day, month, weekDay].every(v => v === '*' || isNum(v!));
}

function formatCronTime(time: string): string {
    const [minute, hour, day, month, weekDay] = time.trim().split(/\s+/);

    return `${minute!.padStart(2, '0')} ${hour!.padStart(2, '0')} ${day} ${month} ${weekDay}`;
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