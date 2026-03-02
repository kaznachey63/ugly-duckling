import cabinet from './commands/cabinet/main';
import main from './commands/cabinet/distribution/main';
import chats from './commands/cabinet/distribution/chats';
import contract from './commands/cabinet/distribution/contract';
import condition from './commands/cabinet/distribution/condition';
import schedule from './commands/cabinet/distribution/schedule';
import message from  './commands/cabinet/distribution/message/main';
import text from './commands/cabinet/distribution/message/text';
import media from './commands/cabinet/distribution/message/media';
import statistic from './commands/cabinet/distribution/statistic';

import settings from './commands/settings/main';
import language from './commands/settings/language';
import about from './commands/settings/about';
import help from './commands/settings/help';

import form from './commands/form';

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
    statistic,

    language
};