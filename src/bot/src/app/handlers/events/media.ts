import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import dispatcher from '@state';

const mediaComposer = new Composer<MyContext>();

mediaComposer.on([':media', ':animation'], async (ctx: MyContext) => {
    try {
        await dispatcher(ctx, "media");
    } catch (error) {
        console.error("Ошибка в media handler:", error);
    }
});

export default mediaComposer;