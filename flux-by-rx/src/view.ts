import * as React from 'react';
import { App } from './app';
import { Action } from './action';
import { Observable } from 'rx';
import { identity } from 'lodash';

function view(state$: Observable<any>, actions$: Observable<Action>) {
    return Observable
        .combineLatest(
            state$,
            actions$.startWith(undefined),
            (state, action) => ({ state, action }))
        .map((props: any) =>
            React.createElement(App, props));
}

export default view;
