export interface ChatWithPermission {
    id: string, 
    title: string,
    canSend: boolean,
    reason: string | undefined
}