import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import common from '@utils/common';

const textComposer = new Composer<MyContext>();

textComposer.on(':text', async (ctx: MyContext) => {
    try {
        await common.dispatchState(ctx, "text");
    } catch (error) {
        console.error("Ошибка в text handler:", error);
    }
});

export default textComposer;