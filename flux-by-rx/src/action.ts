import { Subject } from 'rx';
import { assign } from 'lodash';

export const action$ = new Subject<Action>();

export interface Action {
    update<S>(state: S): S;
}

