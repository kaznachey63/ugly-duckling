import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import dispatcher from '@src/app/handlers/states';

const textComposer = new Composer<MyContext>();

textComposer.on(':text', async (ctx: MyContext) => {
    try {
        await dispatcher(ctx);
    } catch (error) {
        console.error("Ошибка в text handler:", error);
    }
});

export default textComposer;