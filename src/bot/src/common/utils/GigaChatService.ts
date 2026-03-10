// services/GigaChatService.ts
import constants from '@constants';
import axios, { type AxiosInstance } from 'axios';
import https from 'https';
export interface GigaChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export class GigaChatService {
    private axios: AxiosInstance;
    private accessToken: string | null = null;
    private tokenExpiry = 0;

    private readonly OAUTH_URL = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';
    private readonly API_URL = 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions';

    constructor(options: { authKey: string; insecure?: boolean }) {
        const httpsAgent = options.insecure
            ? new https.Agent({ rejectUnauthorized: false })
            : undefined;

        this.axios = axios.create({ httpsAgent });
        this.authKey = options.authKey;
    }

    private authKey: string;

    /**
     * 🔓 ЕДИНСТВЕННЫЙ ПУБЛИЧНЫЙ МЕТОД ДЛЯ ПРОСТОГО ЗАПРОСА
     * Используется в боте: await gigaChat.ask("текст")
     */
    async ask(prompt: string): Promise<string> {
        // Превращаем строку в формат сообщений и передаем во внутренний метод
        return this.sendQuery([{ role: 'user', content: prompt }]);
    }

    /**
     * Отправляет запрос к API, используя токен
     */
    private async sendQuery(messages: GigaChatMessage[]): Promise<string> {
        const token = await this.getValidToken(); // Ждём валидный токен

        const { data } = await this.axios.post(
            this.API_URL,
            {
                model: 'GigaChat:latest',
                messages,
                max_tokens: constants.maxTokens
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        return data.choices[0].message.content;
    }

    /**
     * 🔒 PRIVATE: Логика получения/обновления токена
     * Внешний код не должен это вызывать вручную
     */
    private async getValidToken(): Promise<string> {
        const now = Date.now();
        if (this.accessToken && this.tokenExpiry > now + constants.msInMinute) {
            return this.accessToken;
        }
        return this.refreshToken();
    }

    /**
     * 🔒 PRIVATE: Непосредственный запрос на получение токена
     */
    private async refreshToken(): Promise<string> {
        const response = await this.axios.post(
            this.OAUTH_URL,
            'scope=GIGACHAT_API_PERS',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'RqUID': crypto.randomUUID(),
                    'Authorization': `Basic ${this.authKey}`
                }
            }
        );

        const { access_token, expires_at } = response.data;
        this.accessToken = access_token;
        this.tokenExpiry = new Date(expires_at).getTime();

        return this.accessToken!;
    }
}