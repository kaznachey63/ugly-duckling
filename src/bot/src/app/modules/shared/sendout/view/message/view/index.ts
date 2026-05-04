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
    const match = callbackData.match(/^viewMessage:(\d+)#(\d+)-(prev|next|none)$/);
    
    const sendoutId = Number(match![1]);
    const currentPosition = Number(match![2]); // ← ПОЗИЦИЯ из БД (2, 3, 4...)
    const type = match![3] as PaginationType;

    // Запрашиваем сообщения ТОЛЬКО если нужно вычислить навигацию
    // Если type === 'none' (клик из быстрого доступа) — можно оптимизировать, но для надежности грузим
    const messages = await db.message.getMessages(sendoutId);

    if (!messages?.length) {
        const emptyMenu = menuMessage(ctx, 0, false);
        await ctx.editMessageText(emptyMenu.text, { reply_markup: emptyMenu.keyboard });
        return;
    }

    // Ищем текущий индекс по ПОЗИЦИИ из БД
    let currentIndex = messages.findIndex(m => m.position === currentPosition);
    
    // Фоллбэк: если позиция не найдена (удалено), берем первую или последнюю
    if (currentIndex === -1) {
        currentIndex = type === 'prev' ? messages.length - 1 : 0;
    }

    // Вычисляем целевой индекс
    let targetIndex = currentIndex;
    if (type === 'prev' && currentIndex > 0) targetIndex = currentIndex - 1;
    if (type === 'next' && currentIndex < messages.length - 1) targetIndex = currentIndex + 1;

    const targetMessage = messages[targetIndex]!;
    
    // Сохраняем в сессию только целевое сообщение
    ctx.session.message = targetMessage!;
    
    // Вычисляем номер для отображения (индекс + 1)
    const displayNumber = targetIndex + 1; 
    const total = messages.length;
    
    // 🔥 ГЛАВНОЕ: берем реальные ПОЗИЦИИ соседей из БД для кнопок
    const prevPosition = targetIndex > 0 ? messages[targetIndex - 1]!.position : null;
    const nextPosition = targetIndex < total - 1 ? messages[targetIndex + 1]!.position : null;
    // Также передаем текущую позицию, чтобы меню знало, на чем мы стоим
    const currentTargetPosition = targetMessage.position;

    // Вызываем меню, передавая ВСЕ необходимые данные аргументами
    const menu = menuView.main(
        ctx, 
        total, 
        displayNumber,           // Для текста: "2 / 3"
        prevPosition!,            // Для кнопки ⬅: position из БД
        nextPosition!,            // Для кнопки ➡: position из БД
        currentTargetPosition!    // Текущая position из БД (для надежности)
    );
    
    await ctx.editMessageText(menu.text, { 
        reply_markup: menu.keyboard, 
        parse_mode: "MarkdownV2" 
    });
});

viewComposer.use(messageComposer);
viewComposer.use(textComposer);
viewComposer.use(mediaComposer);

export default viewComposer;