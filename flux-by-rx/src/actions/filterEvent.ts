import { action$, Action } from '../action';
import { registerInitialState } from '../model'
import { assign } from 'lodash';

interface FilterEventState {
    event: string;
}

export class FilterEvent implements Action {
    constructor(private event: string) {}

    update(state: FilterEventState) {
        return assign({}, state, { event: this.event });
    }

    toString() {
        return `{Filter: ${this.event}}`;
    }
}

export let filterEvent = (evt: string) => {
    return action$.onNext(new FilterEvent(evt));
}

registerInitialState({ event: 'PushEvent' });