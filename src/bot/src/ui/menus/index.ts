import cabinet from './cabinet';

import about from './handlers/commands/about';
import help from './handlers/commands/help';
import commandCabinet from './handlers/commands/cabinet';
import form from './handlers/commands/form';

import main from './distribution/main';
import chats from './distribution/sections/chats';
import contract from './distribution/sections/contract';
import condition from './distribution/sections/condition';
import schedule from './distribution/sections/schedule';




export default {
    cabinet,

    help,
    about,
    commandCabinet,
    form,

    main,
    chats,
    contract,
    condition,
    schedule
};