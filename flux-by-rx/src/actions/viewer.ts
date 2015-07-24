import { actions$, registerInitialState } from '../actions';

export let pathChanged  = (path: any) => actions$.onNext({ path });

registerInitialState({ path: '' });