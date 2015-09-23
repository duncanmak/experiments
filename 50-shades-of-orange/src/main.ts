import * as React from 'react';
import { action$ } from './action';
import { Observable } from 'rx';
import { model, initialState } from './model';
import view from './view';
import { retrieve } from './retrieve';

function run() {
    console.log("Running");
    let state$    = model(action$, initialState);

    let output$ = view(state$, action$);
    output$.subscribe((comp: React.ReactElement<any>) => {
        React.render(
            comp,
            document.getElementById('app'))
    });
}

window.onload = run;