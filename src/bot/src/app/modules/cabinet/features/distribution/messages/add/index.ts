import type { MyContext } from '@shared/types/SessionData';
import { Composer } from 'grammy';
import genereteComposer from './generate';
import handComposer from './hand';

const addComposer = new Composer<MyContext>();

addComposer.use(genereteComposer);
addComposer.use(handComposer);

export default addComposer;