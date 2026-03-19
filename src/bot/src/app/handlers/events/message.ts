import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import dispatcher from 'src/app/handlers/states';

const messageComposer = new Composer<MyContext>();

messageComposer.on('message', async (ctx: MyContext) => {
    try {
        await dispatcher(ctx);
    } catch (error) {
        console.error("Ошибка в message handler:", error);
    }
});

export default messageComposer;