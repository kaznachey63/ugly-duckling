import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import dispatcher from '@src/app/handlers/states';

const mediaComposer = new Composer<MyContext>();

mediaComposer.on([':media', ':animation'], async (ctx: MyContext) => {
    try {
        await dispatcher(ctx);
    } catch (error) {
        console.error("Ошибка в media handler:", error);
    }
});

export default mediaComposer;