import type { MyContext, SessionData } from '@shared/types/SessionData';
import { pathToFileURL } from 'url';
import path from 'path';

type StateType = "text" | "media";

/**
 * Обработчик ввода даннных (текст / медиа)
 * @param ctx Контекст
 * @param type Тип обработчика
 */
export async function dispatchState(ctx: MyContext, type: StateType) {
    const states = ctx.session.state[type];

    for (const [state, bool] of Object.entries(states)) {
        if (!bool) continue;

        await ctx.deleteMessage();

        const fileName = `${state}.js`;
        const handlerPath = path.join("src", "states", type, fileName);
        const handlerUrl = pathToFileURL(handlerPath).href;

        try {
            const handlerModule = await import(handlerUrl);
            await handlerModule.default(ctx);
        } catch (error) {
            console.error(`Ошибка в обработчике stateHandler при вызове файла ${fileName}:`, error);
        }
    }
}