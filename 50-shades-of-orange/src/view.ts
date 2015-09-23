import * as React from 'react';
import { App } from './app';
import { Action } from './action';
import { Observable } from 'rx';
import { identity, assign } from 'lodash';
import { github$ } from './boot';

function view(state$: Observable<any>, actions$: Observable<any>) {
    return Observable
        .combineLatest(
            github$,
            state$,
            actions$.startWith(undefined),
            (github, state, action) => ({ state: assign(state, { github }), action }))
        .map((props: any) =>
            React.createElement(App, props));
}

export default view;
