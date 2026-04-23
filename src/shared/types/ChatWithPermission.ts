export type ChatWithPermission = {
    id: string;          // ID из БД (с префиксом -100)
    title: string;
    canSend: boolean;    // true, если можно писать
    reason?: string;     // причина, если false
};