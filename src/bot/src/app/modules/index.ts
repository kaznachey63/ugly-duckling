import { Composer } from 'grammy';
import type { MyContext } from '@shared/types/SessionData';

import cabinetComposer from './cabinet';
import settingsComposer from './settings';
import panelComposer from './panel';
import startComposer from './start';
import formComposer from './form';
import testComposer from './test';

const modulesComposer = new Composer<MyContext>();

modulesComposer.use(cabinetComposer);
modulesComposer.use(settingsComposer);
modulesComposer.use(panelComposer);
modulesComposer.use(startComposer);
modulesComposer.use(formComposer);
modulesComposer.use(testComposer);

export default modulesComposer;