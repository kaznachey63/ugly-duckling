import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import common from '@utils/common';

const mediaComposer = new Composer<MyContext>();

mediaComposer.on([':media', ':animation'], async (ctx: MyContext) => {
    try {
        await common.dispatchState(ctx, "media");
    } catch (error) {
        console.error("Ошибка в media handler:", error);
    }
});

export default mediaComposer;