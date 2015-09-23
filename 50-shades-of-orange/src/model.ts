import * as Rx from 'rx';
import { Observable, Subject } from 'rx';
import { Action } from './action';
import { clone, assign } from 'lodash';

export const initialState = {};

export function registerInitialState(state: any) {
    assign(initialState, state);
}

export function model(action$: Rx.Observable<Action>, initialState: any) {
    let state$ = new Subject();
    action$
        //.scan(initialState, (state: any, actions: Action[]) => actions.reduce((s, action) => action.update(s), state))
        .scan(initialState, (s, action) => action.update(s))
        .subscribe(state$);
    return state$.startWith(initialState);
}