// handlers/test.command.ts
import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import axios from 'axios';
import https from 'https'; // 👈 Импортируем https

const testComposer = new Composer<MyContext>();

// Агент, который игнорирует ошибки сертификатов (ТОЛЬКО ДЛЯ ТЕСТОВ!)
const insecureAgent = new https.Agent({ rejectUnauthorized: false });

// --- Конфигурация ---
const OAUTH_URL = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';
const API_URL = 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions';
const AUTH_KEY = process.env.GIGACHAT_KEY || 'MDE5Y2QzMzktNDZiYS03NzNjLWE1OTItYTQyYmRkNDA3M2FmOmU2YjE3NGFiLTFmMmQtNDViOS1iYTk1LWE5NzUzZWY4YWZiMQ==';

// --- Хранилище токена ---
let accessToken: string | null = null;
let tokenExpiry = 0;

async function getValidToken(): Promise<string> {
    const now = Date.now();
    if (accessToken && tokenExpiry > now + 60_000) {
        return accessToken;
    }

    const response = await axios.post(
        OAUTH_URL,
        'scope=GIGACHAT_API_PERS',
        {
            httpsAgent: insecureAgent, // 👈 Добавили агент
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'RqUID': crypto.randomUUID(),
                'Authorization': `Basic ${AUTH_KEY}`
            }
        }
    );

    const { access_token, expires_at } = response.data;
    accessToken = access_token;
    tokenExpiry = new Date(expires_at).getTime();
    console.log(`[GigaChat] Token obtained, expires: ${expires_at}`);
    return accessToken;
}

async function callGigaChat(prompt: string): Promise<string> {
    const token = await getValidToken();

    const { data } = await axios.post(
        API_URL,
        {
            model: 'GigaChat:latest',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 150
        },
        {
            httpsAgent: insecureAgent, // 👈 Добавили агент
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    );

    return data.choices[0].message.content;
}

// testComposer.command('test', async (ctx: MyContext) => {
//     try {
//         const loading = await ctx.reply('🤔 Думаю...');
//         const prompt = "Напиши одно предложение о сегодняшней погоде в Самаре";
//         const result = await callGigaChat(prompt);
//         await ctx.editMessageText(result, {
//             message_id: loading.message_id,
//             parse_mode: 'HTML'
//         });
//     } catch (error: any) {
//         console.error('[GigaChat Error]:', error.response?.data || error.message);
//         await ctx.reply('❌ Ошибка при обращении к нейросети');
//     }
// });

export default testComposer;