import '@shared/env'; // ← ОБЯЗАТЕЛЬНО ПЕРВОЙ СТРОКОЙ

import { Distribution } from '../distribution/Distribution';
import utils from '../utils';
import { TelegramClient } from "telegram";
import { StringSession } from 'telegram/sessions';
import db from '@shared/db';

let client: TelegramClient | null = null;

async function main() {
    const listDist = await db.credential.getCredentials();
    const name = process.argv[2]!;

    const target = listDist.find(d => d.name === name);
    if (!target) {
        console.error('Рассылка не найдена:', name);
        process.exit(1);
    }

    // ✅ УСТАНАВЛИВАЕМ СХЕМУ ОДИН РАЗ ДЛЯ ЭТОГО ПРОЦЕССА
    process.env.SCHEMA = target.schema;
    process.env.DIST_NAME = target.name; 
    
    const stringSession = new StringSession(target.stringSession || '');
    client = new TelegramClient(stringSession, target.apiId, target.apiHash, {
        connectionRetries: 5,      
        timeout: 10000,            
        floodSleepThreshold: 120,  
    });

    try {
        await client.connect();
        await utils.auth.start(client);

        const distribution = new Distribution(client);
        await distribution.initialize();

        console.log(`✅ Рассылка "${name}" запущена`);
    } catch (error) {
        console.error(`💀 Ошибка запуска "${name}":`, error);
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