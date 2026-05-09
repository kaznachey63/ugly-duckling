import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';
import type { Status } from '@shared/types/server/Status';
import { ServerManager } from 'src/common/services/ServerManager';
import menuCondition from '@menus/modules/commands/panel/system/server/condition';

const logComposer = new Composer<MyContext>();

logComposer.callbackQuery(/^mainLog:/, async (ctx: MyContext) => {
    try {
      
    } catch (error) {
        console.error('Ошибка в mainLog:', error);
    }
});

export default logComposer;