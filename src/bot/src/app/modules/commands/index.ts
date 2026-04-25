import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';

import cabinetComposer from './cabinet';
import settingsComposer from './settings';
import panelComposer from './panel';
import startComposer from './start';

const commandsComposer = new Composer<MyContext>();

commandsComposer.use(cabinetComposer);
commandsComposer.use(settingsComposer);
commandsComposer.use(panelComposer);
commandsComposer.use(startComposer);

export default commandsComposer;