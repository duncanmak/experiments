import { Subject } from 'rx';
import { assign } from 'lodash';

export const actions$ =  new Subject();
export const initialState = {};

export function registerInitialState(state: any) {
    assign(initialState, state);
}
