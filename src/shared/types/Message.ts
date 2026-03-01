export interface Message {
    id?: number;
    caption: string;
    media: string[];
    entities: any[] | null;
}