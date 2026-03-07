import type { MyContext } from '@shared/types/SessionData';
import { addingText, updatingText } from './text/index';
import { addingMedia } from './media/index';

type TypeState = 'text' | 'media' | 'time';

const stateHandlers = {
    addingText,
    updatingText,
    addingMedia,
};

export default async function dispatchState(ctx: MyContext, type: TypeState) {
    const states = ctx.session.state[type];

    for (const [stateName, value] of Object.entries(states)) {
        if (typeof value !== 'boolean' || !value) continue;

        const handlerName = `${stateName}${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof stateHandlers;
        const handler = stateHandlers[handlerName];

        if (handler) {
            await ctx.deleteMessage();
            if (ctx.session.state.ids.idForUpdateMessageFromState) {
                await ctx.api.editMessageText(
                    ctx.chatId!,
                    ctx.session.state.ids.idForUpdateMessageFromState,
                    ctx.t('utils.shared.processing')
                );
            }
            await handler(ctx);
        } else {
            console.warn(`Хендлер для стейта "${handlerName}" не найден`);
        }
    }
}