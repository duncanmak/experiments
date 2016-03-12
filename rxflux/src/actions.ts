import { Subject } from 'rx';
import { partial } from 'lodash';

export const Actions = new Subject<Action>();

export const entryUpdated =
    (idx, evt) => Actions.onNext(partial(updateEntry, idx, evt.target.value));

export const entryRemoved =
    (idx) => Actions.onNext(partial(removeEntry, idx));

export interface Action { <S>(state: S): S };
// export type Action = <S>(state: S) => S;

function updateEntry(idx: number, text: string, state: string[]) {
    let newState = [...state];
    newState.splice(idx, 1, text);
    return newState;
};

function removeEntry(idx: number, state: string[]) {
    let newState = [...state];
    newState.splice(idx, 1);
    return newState;
};