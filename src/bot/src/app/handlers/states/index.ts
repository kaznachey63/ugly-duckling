import type { MyContext } from '@shared/types/SessionData';

import addingIdea from './addingIdea';
import addingText from './addingText';
import addingMedia from './addingMedia';
import addingTime from './addingTime';
import addingUser from './addingUser';
import addingContract from './addingContract';
import updatingText from './updatingText';
import updatingTime from './updatingTime';
import updatingUserName from './updatingUserName';
import updatingUserPhone from './updatingUserPhone';
import updatingSendoutCall from './updatingSendoutCall';
import generatingText from './generatingText';
import passingAuthorization from './passingAuthorization';

const stateHandlers: Record<string, (ctx: MyContext) => Promise<void>> = {
    addingIdea,
    addingText,
    addingMedia,
    addingTime,
    addingUser,
    addingContract,
    updatingText,
    updatingTime,
    updatingUserName,
    updatingUserPhone,
    updatingSendoutCall,
    generatingText,
    passingAuthorization,
};

export default async function dispatchState(ctx: MyContext) {
    const states = ctx.session.state;

    for (const [stateName, value] of Object.entries(states)) {
        if (typeof value !== 'boolean' || !value) continue;

        const handler = stateHandlers[stateName];

        if (handler) {
            setTimeout(async() => {
                await ctx.deleteMessage();
            }, 300);
            
            if (ctx.session.other.ids.idForUpdateMessageFromState) {
                await ctx.api.editMessageText(
                    ctx.chatId!,
                    ctx.session.other.ids.idForUpdateMessageFromState,
                    ctx.t("utils.shared.processing")
                );
            }
            await handler(ctx);
        } else {
            console.warn(`Хендлер для стейта "${stateName}" не найден`);
        }
    }
}