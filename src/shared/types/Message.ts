export interface Message {
    id?: number;
    caption: string;
    media: string[] | null;
    entities: any[] | null;
}