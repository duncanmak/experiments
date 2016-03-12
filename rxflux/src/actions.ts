import { Subject } from 'rx';

export const Actions = new Subject<Action>();

export const entryUpdated =
    (idx, evt) => Actions.onNext(new UpdateEntry(idx, evt.target.value));

export const entryRemoved =
    (idx) => Actions.onNext(new RemoveEntry(idx))

export interface Action { update<S>(state: S): S }

class UpdateEntry implements Action {
    constructor(private index: number, private text: string) {
    }
    update(state: string[]) {
        let newState = [...state];
        newState.splice(this.index, 1, this.text);
        return newState;
    }
}

class RemoveEntry implements Action {
    constructor(private index: number) {
    }
    update(state: string[]) {
        let newState = [...state];
        newState.splice(this.index, 1);
        return newState;
    }
}