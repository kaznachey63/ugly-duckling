import GigaChat from "gigachat";
import { Agent } from "https";
import { readFileSync } from "fs";
import path from "path";
import constants from "@constants";

export class GigaChatService {
    private client: GigaChat;

    constructor(credentials: string) {
        const certsDir = path.resolve(path.join('./certs'));

        const caBundle = [
            readFileSync(path.resolve(certsDir, "root.crt")),
            readFileSync(path.resolve(certsDir, "sub.crt"))
        ];

        const httpsAgent = new Agent({ ca: caBundle });

        this.client = new GigaChat({
            credentials,
            httpsAgent,
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