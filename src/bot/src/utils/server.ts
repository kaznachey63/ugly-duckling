import { NodeSSH } from 'node-ssh';
import type { MyContext, SessionData } from '@shared/types/SessionData';
import utils from '../utils/index.js';

/**
 * Подключение к серверу
 * @returns Объект сервера  
 */
async function connectServer(): Promise<NodeSSH> {
    const ssh = new NodeSSH();
    await ssh.connect({
        host: process.env.SERVER_HOST,
        username: process.env.SERVER_USERNAME,
        password: process.env.SERVER_PASSWORD
    });
    return ssh;
}

/**
 * Проверка статуса сервиса на сервере
 * @param ctx Контекст
 */
async function checkStatus(ctx: MyContext) {
    const nameDistribution = ctx.session.distribution.name!;
    const nameProcess = utils.local.getNameProcess(nameDistribution);
    
    const ssh = await connectServer();
    let result;
    let checkStatusButtons = [];
    let textMessage = "";

    try {
        try {
            result = await ssh.execCommand(`systemctl status ${nameProcess}`, { cwd: "/etc/systemd/system" });
        } catch (error) {
            console.error("Ошибка execCommand:", error);
        }
        
        switch (await getStatusProcess(nameProcess)) {
            case "active": {
                checkStatusButtons.push(
                    [Markup.button.callback("🛑 Стоп", "stopService" + nameDistribution)],
                );
                textMessage = "✅ Процесс активен.\nЧтобы остановить, нажмите на кнопку ниже ⬇";
                break;
            }
            case "failed":
            case "inactive": {
                checkStatusButtons.push(
                    [Markup.button.callback("▶️ Запуск", "startService" + nameDistribution)]
                );
                textMessage = "❌ Процесс неактивен.\nЧтобы запустить, нажмите на кнопку ниже ⬇";
                break;
            }
            default: {
                textMessage = `Проблема с процессом у -${ctx.session.distribution.call}\n${result?.stderr}`;
            }
        }

        checkStatusButtons.push(
            [Markup.button.callback("🔙 Назад", "menuDistribution" + nameDistribution)]
        );

        await ctx.editMessageText(utils.formatting.escapeMarkdown
            (
                textMessage += `\n\n[📍 Путь: Кабинет → Меню «${ctx.session.distribution.call}» → *Состояние*]`
            ),
            {
                parse_mode: "MarkdownV2",
                ...Markup.inlineKeyboard(checkStatusButtons)
            }
        );
    } catch (error) {
        console.error(error);
    } finally {
        ssh.dispose();
    }
}

/**
 * Перезагрузка сервиса
 * @param ctx Контекст
 * @returns Обновлено / не обновлено
 */
async function reloadService(nameDistribution: string): Promise<boolean> {
    const nameProcess = utils.local.getNameProcess(nameDistribution);
    let  hasActive = false;
    const ssh = await connectServer();

    try {
        // процесс активный - останавливаем
        if (await getStatusProcess(nameProcess) === "active") {
            await ssh.execCommand(`systemctl stop ${nameProcess}`, { cwd: "/etc/systemd/system" });
            hasActive = true
        }

        // обновляем для любого состояния
        await ssh.execCommand("systemctl daemon-reload", { cwd: "/etc/systemd/system" });

        // процесс был активным - запускаем его заново
        if (hasActive) {
            await ssh.execCommand("systemctl start " + nameProcess, { cwd: "/etc/systemd/system" });

            // запуск успешен 
            if (await getStatusProcess(nameProcess) === "active") {
                return true;
            }
            // запуск НЕ успешен 
            else {
                return false;
            }
        }
        // процесс НЕ был активным 
        else {
            return true;
        }
    } catch (error) {
        console.error("Ошибка в обновлении процесса:", error);
        return false;
    } finally {
        ssh.dispose();
    }
}

/**
 * Получение статуса процеса
 * @param nameProcess Имя процесса на сервере
 * @returns Строку обозначающую результат
 */
async function getStatusProcess(nameProcess: string): Promise<string> {
    const ssh = await connectServer();

    try {
        const result = (await ssh.execCommand(`systemctl status ${nameProcess}`, { cwd: "/etc/systemd/system" })).stdout.trim();

        if (result.includes("Active: active")) {
            return "active";
        }
        else if (result.trim().includes("Active: inactive")) {
            return "inactive";
        }
        else if (result.trim().includes("Active: failed")) {
            return "failed";
        }
        else {
            return "";
        }
    } catch (error) {
        console.error("Ошибка в получении статуса:", error);
        return "";
    }
    finally {
        ssh.dispose();
    }
}

export default {
    connectServer,
    checkStatus,
    reloadService,
    getStatusProcess
};