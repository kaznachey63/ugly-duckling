import type { MyContext, SessionData } from '@shared/types/SessionData';
import utils from '@utils';
import handler from '../handlers';

/**
 * Обработка команды form
 * @param ctx Контекст
 */
export default async function document(ctx: MyContext) {
    if (!ctx || !ctx.message || !('document' in ctx.message)) return;
    try {
        const states = ctx.session.state["media"];

        for (const [, bool] of Object.entries(states)) {
            if (!bool) continue;

            if (utils.local.checkMediaInDocument(ctx?.message?.document?.mime_type!)) {
                handler.dispatchState(ctx, "media");
                break;
            }
            else {
                try { await ctx.deleteMessage(); } catch (e) {};
                await ctx.reply("Я не умею обрабатывать документы, не содержащие медиа");
                break;
            }
        }
    } catch (error) {
        console.error("Ошибка в обработке команды document: ", error);
    }
}