import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import utils from '@utils';
import dispatcher from '@state';

const documentComposer = new Composer<MyContext>();

documentComposer.on(':document', async (ctx: MyContext) => {
    if (!ctx?.message?.document) return;

    try {
        const mime = ctx.message.document.mime_type;

        // 🔹 Только если это медиа-документ — передаём в медиа-стейт
        if (utils.local.checkMediaInDocument(mime!)) {
            await dispatcher(ctx, "media");
            return;
        }

        // 🔹 Если нужен отдельный поток для "чистых" документов — раскомментируй:
        // else {
        //     await dispatchState(ctx, "document");
        //     return;
        // }

        // 🔹 Иначе — игнорируем (чтобы не ломать медиа-поток)
    } catch (error) {
        console.error("Ошибка в document handler:", error);
    }
});

export default documentComposer;