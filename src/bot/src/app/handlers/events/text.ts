import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import dispatcher from '@state';

const textComposer = new Composer<MyContext>();

textComposer.on(':text', async (ctx: MyContext) => {
    try {
        await dispatcher(ctx, "text");
    } catch (error) {
        console.error("Ошибка в text handler:", error);
    }
});

export default textComposer;