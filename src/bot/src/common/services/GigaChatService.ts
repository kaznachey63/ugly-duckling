import GigaChat from "gigachat";
import { Agent } from "https";
import { readFileSync } from "fs";
import { resolve } from "path";
import constants from "@constants";

export class GigaChatService {
    private client: GigaChat;

    constructor(credentials: string) {
        const certsDir = resolve(process.cwd(), "certs");

        const caBundle = [
            readFileSync(resolve(certsDir, "root.crt")),
            readFileSync(resolve(certsDir, "sub.crt"))
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