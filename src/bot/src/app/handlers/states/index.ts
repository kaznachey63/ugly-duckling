import type { MyContext } from '@shared/types/SessionData';
import { addingText, updatingText } from './text/index';
import { addingMedia } from './media/index'

type TypeState = 'text' | 'media' | 'time';

const stateHandlers = {
    addingText,
    updatingText,
    addingMedia,
};

export default async function dispatchState(ctx: MyContext, type: TypeState) {
    const states = ctx.session.state[type];

    for (const [stateName, isActive] of Object.entries(states)) {
        if (!isActive) continue;

        const handler = stateHandlers[stateName as keyof typeof stateHandlers];

        if (handler) {
            await ctx.deleteMessage();
            if (ctx.session.state.idForUpdateMessageFromState) {
                await ctx.api.editMessageText(
                    ctx.chatId!,
                    ctx.session.state.idForUpdateMessageFromState,
                    ctx.t('utils.shared.processing')
                );
            }
            await handler(ctx);
        } else {
            console.warn(`Хендлер для стейта "${stateName}" не найден`);
        }
    }
}