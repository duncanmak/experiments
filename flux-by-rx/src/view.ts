import * as React from 'react';
import { App } from './app';
import { Observable } from 'rx';

function view(actions$: Observable<any>, state$: Observable<any>) {
    // let o = Observable.zip(actions$, state$, (action: any, state: any) => ({action, state}));
    let o = state$;
    return o.map((props: any) => {
        return React.createElement(App, props);
    });
}

export default view;
