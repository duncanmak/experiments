import * as React from 'react';
import { action$ } from './action';
import * as Rx from 'rx';
import { Observable, Subject } from 'rx';
import { model, initialState } from './model';
import view from './view';

const lrApi = require('livereactload-api')

function run() {
    let state$ = model(action$, lrApi.getState() || initialState);
    state$.subscribe((s: any) => lrApi.setState(s));

    let output$ = view(state$, action$);
    output$.subscribe((comp) => {
        React.render(
            comp,
            document.getElementById('app'))
    });
}

// live reloading
lrApi.onReload(() => run())
window.onload = run;