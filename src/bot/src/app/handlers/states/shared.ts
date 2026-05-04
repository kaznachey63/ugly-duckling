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
    const trimmed = time.trim();
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5]?[0-9]$/;

    if (timeRegex.test(trimmed)) {
        return true;
    }

    const parts = trimmed.split(/\s+/);
    return parts.length === 5;
}

function formatCronTime(time: string): string {
    const trimmed = time.trim();
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5]?[0-9]$/;

    if (timeRegex.test(trimmed)) {
        const [hour, minute] = trimmed.split(':');
        return `${minute!.padStart(2, '0')} ${hour!.padStart(2, '0')} * * *`;
    }

    const [minute, hour, day, month, week_day] = trimmed.split(/\s+/);
    return `${minute!.padStart(2, '0')} ${hour!.padStart(2, '0')} ${day} ${month} ${week_day}`;
}

export default {
    validateText,
    validateTime,
    formatCronTime
}