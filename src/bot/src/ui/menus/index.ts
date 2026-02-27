import about from './commands/about';
import help from './commands/help';
import cabinet from './commands/cabinet/main';
import form from './commands/form';
import settings from './commands/settings/main';

import main from './commands/cabinet/distribution/main';
import chats from './commands/cabinet/distribution/sections/chats';
import contract from './commands/cabinet/distribution/sections/contract';
import condition from './commands/cabinet/distribution/sections/condition';
import schedule from './commands/cabinet/distribution/sections/schedule';
import message from  './commands/cabinet/distribution/sections/message/main';
import text from './commands/cabinet/distribution/sections/message/text';
import media from './commands/cabinet/distribution/sections/message/media';
import statistic from './commands/cabinet/distribution/sections/statistic';

export default {
    cabinet,
    help,
    about,
    form,
    settings,

    main,
    chats,
    contract,
    condition,
    schedule,
    message,
    text,
    media,
    statistic
};