import type { MyContext } from '@shared/types/SessionData';

export default async function dispatchState(ctx: MyContext) {
    const states = ctx.session.state;

    for (const [stateName, value] of Object.entries(states)) {
        if (typeof value !== 'boolean' || !value) continue;

        const mod = await import(`./${stateName}`);
        const handler = mod.default;

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