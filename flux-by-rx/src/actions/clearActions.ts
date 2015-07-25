import { action$, Action } from '../action';

export let clearActions = () => action$.onNext(new ClearActions());

export class ClearActions implements Action {
    update (state: any) { return state; }
}
