import { Sendout} from '../modules/Sendout';
import utils from '../utils';
import { TelegramClient } from "telegram";
import { StringSession } from 'telegram/sessions';
import db from '@shared/db';

let client: TelegramClient | null = null;

async function main() {
    const listDist = await db.sendout.getSendoutsInfoWithCredentials();
    const sendoutName = process.argv[2]!;

    const targetSendout = listDist?.find(d => d.name === sendoutName);
    if (!targetSendout) {
        console.error('Рассылка не найдена:', sendoutName);
        process.exit(1);
    }
    
    const stringSession = new StringSession(targetSendout.credential?.string_session || '');
    client = new TelegramClient(stringSession, Number(targetSendout.credential?.api_id)!, targetSendout.credential?.api_hash!, {
        connectionRetries: 5,      
        timeout: 10000,            
        floodSleepThreshold: 120,  
    });

    try {
        await client.connect();
        await utils.auth.start(client, targetSendout);

        const sendout = new Sendout(client, targetSendout);
        await sendout.initialize();

        console.log(`✅ Рассылка "${sendoutName}" запущена`);
    } catch (error) {
        console.error(`💀 Ошибка запуска "${sendoutName}":`, error);
        await client?.disconnect().catch(() => { });
        process.exit(1);
    }
}

// Корректное завершение
async function shutdown() {
    console.log('\n🛑 Завершаем работу...');
    if (client) {
        await client.disconnect().catch(() => { });
        console.log('✅ Отключение от Telegram завершено');
    }
    process.exit(0);
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

main();