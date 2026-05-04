import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import mediaComposer from './media';
import textComposer from './text';
import messageComposer from './message';
import db from '@shared/db';
import menuView from '@menus/modules/shared/sendout/view/message/view';
import menuMessage from '@menus/modules/shared/sendout/view/message/main';
import type { PaginationType } from '@shared/types/PaginationType';

const viewComposer = new Composer<MyContext>();

viewComposer.callbackQuery(/^viewMessage:(\d+)#(\d+)-(prev|next|none)$/, async (ctx: MyContext) => {
    const callbackData = ctx.callbackQuery?.data!;
    const [, sendoutIdStr, currentPosStr, type] = callbackData.match(/^viewMessage:(\d+)#(\d+)-(prev|next|none)$/) || [];
    const sendoutId = Number(sendoutIdStr);
    const currentDbPos = Number(currentPosStr);
    const paginationType = type as PaginationType;

    // Важно: getMessages должен возвращать список, отсортированный по position ASC
    const messages = await db.message.getMessages(sendoutId);

    if (!messages?.length) {
        const emptyMenu = menuMessage(ctx, 0, false);
        await ctx.editMessageText(emptyMenu.text, { reply_markup: emptyMenu.keyboard });
        return;
    }

    // Находим индекс текущего сообщения в отсортированном массиве
    let currentIndex = messages.findIndex(m => m.position === currentDbPos);
    if (currentIndex === -1) currentIndex = 0; // Фоллбэк, если запись уже удалена

    // Определяем целевую DB-позицию для переключения
    let targetDbPos = currentDbPos;
    if (paginationType === 'prev' && currentIndex > 0) {
        targetDbPos = messages[currentIndex - 1]!.position!;
    } else if (paginationType === 'next' && currentIndex < messages.length - 1) {
        targetDbPos = messages[currentIndex + 1]!.position!;
    }

    // Загружаем целевое сообщение
    ctx.session.message = (await db.message.getByIdForPagination(sendoutId, targetDbPos, paginationType))!;
    if (!ctx.session.message) {
        // На случай гонки или удаления
        const emptyMenu = menuMessage(ctx, 0, false);
        await ctx.editMessageText(emptyMenu.text, { reply_markup: emptyMenu.keyboard });
        return;
    }

    // Пересчитываем UI-индекс после загрузки
    const newIndex = messages.findIndex(m => m.position === ctx.session.message!.position);
    const displayIndex = newIndex + 1; // 1-based для отображения
    const prevDbPos = newIndex > 0 ? messages[newIndex - 1]!.position : null;
    const nextDbPos = newIndex < messages.length - 1 ? messages[newIndex + 1]!.position : null;

    const menu = menuView.main(ctx, messages.length, displayIndex, prevDbPos!, nextDbPos!);
    await ctx.editMessageText(menu.text, { reply_markup: menu.keyboard, parse_mode: "MarkdownV2" });
});

viewComposer.use(messageComposer);
viewComposer.use(textComposer);
viewComposer.use(mediaComposer);

export default viewComposer;