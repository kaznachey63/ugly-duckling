import '@shared/env'; // ← ОБЯЗАТЕЛЬНО ПЕРВОЙ СТРОКОЙ
import auth from '@shared/auth';
import helpers from '../helpers';
import cron from 'node-cron';
import db from '@shared/db';

// cron.schedule("49 10 * * *", async () => {
    try {
        await db.chat.clear();
        const credentials = await db.sendout.getSendoutsInfoWithCredentials();

        const chatPromises = credentials?.map(async (dist) => {
            const client = await auth.start2(dist);
            try {
                return await helpers.chatsFromClient(client);
            }  finally { 
                await client.disconnect(); 
            }
        });

        const allChats = (await Promise.all(chatPromises!)).flat();
        const uniqueChatList = helpers.createUniqueList(allChats);
        await db.chat.insert(uniqueChatList);
    } catch (err) {
        console.error('Критическая ошибка при запуске парсера чатов', err);
        process.exit(1);
    }
    process.exit(0);
// },
// {
//     timezone: "Europe/Moscow"
// });