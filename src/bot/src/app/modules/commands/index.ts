import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';

import cabinetComposer from './cabinet';
import settingsComposer from './settings';
import panelComposer from './panel';
import startComposer from './start';
import authComposer from './auth';

const commandsComposer = new Composer<MyContext>();

commandsComposer.use(cabinetComposer);
commandsComposer.use(settingsComposer);
commandsComposer.use(panelComposer);
commandsComposer.use(startComposer);
commandsComposer.use(authComposer);

export default commandsComposer;