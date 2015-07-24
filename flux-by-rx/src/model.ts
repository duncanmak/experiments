import * as Rx from 'rx';
import { Observable, Subject } from 'rx';
import { clone, assign } from 'lodash';
import { initialState } from './actions';

function model(actions$: Rx.Observable<any>) {
    let state$ = new Subject();
    let initial$ = state$.startWith(initialState);
    actions$.subscribe(a => state$.onNext(a));

    return initial$.scan((actions, nextAction) => {
        let {leftClicked, rightClicked, path}: any = assign({}, actions, nextAction);

        let isDisabled = leftClicked == rightClicked == true;
        return {isDisabled, leftClicked, rightClicked, path};
    });
}

export default model;