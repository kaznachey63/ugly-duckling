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

    const sendoutId = Number(match[1]);
    const currentMsgId = Number(match[2]); // <-- Теперь это ID сообщения, а не позиция!
    const type = match[3] as 'prev' | 'next' | 'none';

    // 1. Получаем ВСЕ сообщения рассылки, отсортированные по позиции
    // Важно: getMessages должен делать .orderBy({ position: 'asc' })
    const messages = await db.message.getMessages(sendoutId);

    if (!messages?.length) {
        const emptyMenu = menuMessage(ctx, 0, false);
        await ctx.editMessageText(emptyMenu.text, { reply_markup: emptyMenu.keyboard });
        return;
    }

    // 2. Ищем индекс текущего сообщения в массиве по его УНИКАЛЬНОМУ ID
    let currentIndex = messages.findIndex(m => m.id === currentMsgId);
    
    // Если сообщение не найдено (удалено), берем первое или последнее в зависимости от направления
    if (currentIndex === -1) {
        currentIndex = type === 'prev' ? messages.length - 1 : 0;
    }

    // 3. Вычисляем целевой индекс
    let targetIndex = currentIndex;
    if (type === 'prev' && currentIndex > 0) targetIndex = currentIndex - 1;
    if (type === 'next' && currentIndex < messages.length - 1) targetIndex = currentIndex + 1;

    const targetMessage = messages[targetIndex];
    
    // 4. Сохраняем в сессию и рендерим меню
    ctx.session.message = targetMessage;
    
    // Вычисляем красивый номер для отображения (индекс + 1)
    const displayNumber = targetIndex + 1; 
    const total = messages.length;
    
    // Определяем реальные ID соседей для кнопок
    const prevId = targetIndex > 0 ? messages[targetIndex - 1].id : null;
    const nextId = targetIndex < total - 1 ? messages[targetIndex + 1].id : null;

    const menu = menuView.main(ctx, total, displayNumber, prevId, nextId);
    
    await ctx.editMessageText(menu.text, { 
        reply_markup: menu.keyboard, 
        parse_mode: "MarkdownV2" 
    });
});

viewComposer.use(messageComposer);
viewComposer.use(textComposer);
viewComposer.use(mediaComposer);

export default viewComposer;