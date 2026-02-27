import cabinet from './cabinet';

import about from './handlers/commands/about';
import help from './handlers/commands/help';
import commandCabinet from './handlers/commands/cabinet';
import form from './handlers/commands/form';
import settings from './handlers/commands/settings';

import main from './distribution/main';
import chats from './distribution/sections/chats';
import contract from './distribution/sections/contract';
import condition from './distribution/sections/condition';
import schedule from './distribution/sections/schedule';
import message from  './distribution/sections/message/main';
import text from './distribution/sections/message/text';
import media from './distribution/sections/message/media';
import statistic from './distribution/sections/statistic';

export default {
    cabinet,

    help,
    about,
    commandCabinet,
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