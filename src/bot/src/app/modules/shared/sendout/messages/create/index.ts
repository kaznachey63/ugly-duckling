import type { MyContext } from '@shared/types/SessionData';
import { Composer } from 'grammy';
import genereteComposer from './generate';
import handComposer from './hand';

const createComposer = new Composer<MyContext>();

createComposer.use(genereteComposer);
createComposer.use(handComposer);

export default createComposer;