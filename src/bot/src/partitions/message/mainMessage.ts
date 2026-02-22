import db from '@shared/db';
import utils from "@utils";
import type { MyContext, SessionData } from '@shared/types/SessionData';

export default async function mainMessage(ctx: MyContext) {
    utils.common.sessionReset(ctx.session);
    const queryData = "data" in ctx.callbackQuery! ? ctx.callbackQuery.data : null;
    const nameDistribution = ctx.session.distribution.name!;

    const messages = await db.message.getMessagesForBot(nameDistribution);
    if (!messages) return;
        
    // Базовые кнопки
    const mainMessageButtons = [
        [Markup.button.callback("⬇ Параметры сообщений ⬇", "parametrsMessage")],
        [
            Markup.button.callback("📄 Добавить", "addText" + nameDistribution),
            Markup.button.callback("🗑 Удалить все", `deleteAllText${nameDistribution}`, !messages.length)
        ]
    ]; 
       
    let textMessage = "";

    // Текста нет
    if (!messages.length) {
        textMessage = "Сообщений нет\!\nЧтобы добавить текст, нажми на кнопку ниже";
    } else { // Текст есть
        const paginationIndex = Number(queryData!.split(/:/)[1]) || 0;
        // Параметры текста
        mainMessageButtons.push(
            [Markup.button.callback("⬇ Параметры текста ⬇", "parametrsText")],
            [
                Markup.button.callback("✍️ Изменить", `editText${nameDistribution}:${paginationIndex}`),
                Markup.button.callback("🗑 Удалить", `deleteText${nameDistribution}:${paginationIndex}`),
            ]
        );

        // Параметры медиа
        mainMessageButtons.push(
            [Markup.button.callback("⬇ Параметры медиа ⬇", "parametrsMedia")],
            [
                Markup.button.callback("🖼 Добавить", `addMedia${nameDistribution}:${paginationIndex}`),
                Markup.button.callback("🗑 Удалить все", `deleteMedia${nameDistribution}:${paginationIndex}`)
            ]
        );

        const message = messages[paginationIndex]!;
        textMessage = `Сообщение №${paginationIndex + 1}.`;
        textMessage += ` Количество медиа: ${message.media?.length! || 0} / 4.` + `\n\`\`\`\n${message?.caption!}\n\`\`\``;

        // Навигация по текстам
        const navigationButtons: typeof mainMessageButtons = [];
        if (messages.length === 1) {
            navigationButtons.push([
                Markup.button.callback(
                    `${paginationIndex + 1} / ${messages.length}`,
                    `amountText${nameDistribution}:${paginationIndex + 1}/${messages.length}`
                )
            ]);
        } else if (paginationIndex === 0) {
            navigationButtons.push([
                Markup.button.callback(
                    `${paginationIndex + 1} / ${messages.length}`,
                    `amountText${nameDistribution}:${paginationIndex + 1}/${messages.length}`
                ),
                Markup.button.callback(
                    "➡",
                    `mainMessage${nameDistribution}:${paginationIndex + 1}`
                )
            ]);
        } else if (paginationIndex + 1 === messages.length) {
            navigationButtons.push([
                Markup.button.callback(
                    "⬅",
                    `mainMessage${nameDistribution}:${paginationIndex - 1}`
                ),
                Markup.button.callback(
                    `${paginationIndex + 1} / ${messages.length}`,
                    `amountText${nameDistribution}:${paginationIndex + 1}/${messages.length}`
                )
            ]);
        } else {
            navigationButtons.push([
                Markup.button.callback(
                    "⬅",
                    `mainMessage${nameDistribution}:${paginationIndex - 1}`
                ),
                Markup.button.callback(
                    `${paginationIndex + 1} / ${messages.length}`,
                    `amountText${nameDistribution}:${paginationIndex + 1}/${messages.length}`
                ),
                Markup.button.callback(
                    "➡",
                    `mainMessage${nameDistribution}:${paginationIndex + 1}`
                )
            ]);
        }

        mainMessageButtons.push(...navigationButtons);
    }

    // Кнопка назад
    mainMessageButtons.push([
        Markup.button.callback("🔙 Назад", "menuDistribution" + nameDistribution)
    ]);

    // Отправка сообщения с клавиатурой
    const msg = await ctx.editMessageText(utils.formatting.escapeMarkdown
        (
            textMessage + `\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → *Сообщения*]`
        ),
        {
            ...Markup.inlineKeyboard(mainMessageButtons),
            parse_mode: "MarkdownV2"
        }
    );

    // Сохранение айди для последующего редактирования этого же сообщения
    if (typeof msg !== "boolean" && "message_id" in msg) {
        ctx.session.messageIds.forTextOrMedia = msg.message_id;
    }
}