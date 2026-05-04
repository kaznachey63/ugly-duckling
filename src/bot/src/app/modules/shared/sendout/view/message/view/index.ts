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
    // 🔥 ЭТО ПОЗИЦИЯ, НА КОТОРУЮ НУЖНО ПОПАСТЬ (цель), а не точка старта
    const targetPosition = Number(match[2]); 
    const type = match[3] as 'prev' | 'next' | 'none';

    const messages = await db.message.getMessages(sendoutId);

    if (!messages?.length) {
        const emptyMenu = menuMessage(ctx, 0, false);
        await ctx.editMessageText(emptyMenu.text, { reply_markup: emptyMenu.keyboard });
        return;
    }

    // 🔥 ИСПРАВЛЕНИЕ: Ищем индекс сразу по целевой позиции из колбэка
    let targetIndex = messages.findIndex(m => m.position === targetPosition);
    
    // Если целевая позиция не найдена (сообщение удалили), берем первое или последнее
    if (targetIndex === -1) {
        targetIndex = type === 'prev' ? messages.length - 1 : 0;
    }

    const targetMessage = messages[targetIndex];
    
    // Сохраняем в сессию
    ctx.session.message = targetMessage;
    
    // Вычисляем номер для отображения (индекс + 1)
    const displayNumber = targetIndex + 1; 
    const total = messages.length;
    
    // Берем реальные ПОЗИЦИИ соседей из БД для кнопок
    const prevPosition = targetIndex > 0 ? messages[targetIndex - 1].position : null;
    const nextPosition = targetIndex < total - 1 ? messages[targetIndex + 1].position : null;

    const menu = menuView.main(
        ctx, 
        total, 
        displayNumber,           // Для текста: "2 / 3"
        prevPosition,            // Для кнопки ⬅: position из БД
        nextPosition,            // Для кнопки ➡: position из БД
        targetPosition           // Текущая position из БД (для paginationCb)
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