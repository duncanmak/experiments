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
    action$.scan(initialState, (state: any, action: Action) => action.update(state)).subscribe(state$);
    return state$.startWith(initialState);
}