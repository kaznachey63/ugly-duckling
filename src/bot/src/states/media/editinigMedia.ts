import { fs, path, MyContext, button, func, fetch, randomUUID } from '../imports.js';

export default async function editinigMedia(ctx: MyContext) {
    const msg = ctx.message;

    if (!msg || !('photo' in msg || 'video' in msg || 'animation' in msg)) return;

    const nameDistribution = ctx.session.distribution.name!;
    const textIndex = ctx.session.typePartition.media.id!;
    const editedPathFile = path.join("", "resources", "messages.json");

    let whichMedia: any;
    let nameFile = randomUUID().toString();

    if ('photo' in msg && msg.photo) {
        whichMedia = msg.photo[msg.photo.length - 1]!;
        nameFile += ".jpg";
    }
    else if ('video' in msg && msg.video) {
        whichMedia = msg.video!;
        nameFile += ".mp4";
    }
    else if ('animation' in msg && msg.animation) {
        whichMedia = msg.animation!;
        nameFile += ".mp4";
    } else {
        return;
    }

    try {
        const fileLink = await ctx.telegram.getFileLink(whichMedia.file_id);
        const pathFile = path.join(mediaDir, nameFile);
        const response = await fetch(fileLink.href);

        // Проверка на корректный тип медиа
        const contentType = response.headers.get('content-type');
        if (!['image/jpeg', 'video/mp4', 'image/gif'].includes(contentType!)) {
            await ctx.reply("Некорректный тип медиа. Попробуйте снова");
            return;
        }

        // Проверка размера файла (например, максимум 3 МБ)
        const maxSize = 3 * 1024 * 1024; // 3 МБ
        const contentLength = Number(response.headers.get('content-length'));

        if (contentLength && contentLength > maxSize) {
            await ctx.reply("Файл слишком большой. Максимальный размер 3 МБ.");
            return;
        }

        const arrayBuffer = await response.arrayBuffer();
        await fs.mkdir(mediaDir, { recursive: true });
        await fs.writeFile(pathFile, Buffer.from(arrayBuffer));

        // обновляем JSON
        let lastMessages = await func.file.readJson(nameDistribution, "resources", "messages");
        lastMessages[messageIndex] = {
            text: lastMessages[messageIndex].text ?? "",
            media: [nameFile] // сохраняем только одно медиа
        };

        await fs.writeFile(editedPathFile, JSON.stringify(lastMessages, null, 2));

        // отправляем пользователю уведомление
        button.menu.menuMessages.reply_markup.inline_keyboard = [[]];
        (button.menu.menuMessages.reply_markup.inline_keyboard as any) = [
            [{ text: "Назад в Сообщения", callback_data: "mainMessage" + nameDistribution }]
        ];
   
        if (await func.server.reloadService(nameDistribution)) {
            await ctx.reply("Медиа изменено!", button.menu.menuMessages);
        }
        else {
            await ctx.reply("Медиа не изменено!\nОбратитесь к администратору", button.menu.menuMessages);
        }
    } catch (err) {
        console.error("Ошибка при изменении медиа:", err);
    }
}