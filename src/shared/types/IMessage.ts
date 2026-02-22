export interface IMessage {
    id: number;
    caption: string;
    media: string[] | null;
    entities: any[] | null;
}