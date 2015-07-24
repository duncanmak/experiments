import * as React from 'react';
import { App } from './app';
import { Observable } from 'rx';
import { identity } from 'lodash';

function view(state$: Observable<any>, actions$: Observable<any>) {
    let o = Observable.combineLatest(state$, actions$.startWith({}), (state, action) => ({ state, action }));
    return o.map((props: any) => {
        return React.createElement(App, props);
    });
}

export default view;
