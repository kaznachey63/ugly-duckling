import GigaChat from "gigachat";
import constants from "@constants";

export class GigaChatService {
    private client: GigaChat;

    constructor(credentials: string) {
        this.client = new GigaChat({
            credentials,
            timeout: constants.gigaChat.timeout
        });
    }

    async ask(prompt: string): Promise<string> {
        const response = await this.client.chat({
            messages: [
                { role: "system", content: constants.gigaChat.systemPrompt },
                { role: "user", content: prompt }
            ],
            temperature: constants.gigaChat.temperature,
            max_tokens: constants.gigaChat.maxTokens
        });
        return response.choices[0]?.message.content ?? "";
    }
}