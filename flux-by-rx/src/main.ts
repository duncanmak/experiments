import * as React from 'react';
import { action$ } from './action';
import { Observable } from 'rx';
import { model, initialState } from './model';
import view from './view';

function run() {
    console.log("Running");
    let playback$ = action$; //.scan([], (actions, a) => [...actions, a]);
    let state$ = model(playback$, initialState);

    let output$ = view(state$, playback$);
    output$.subscribe((comp) => {
        React.render(
            comp,
            document.getElementById('app'))
    });
}

window.onload = run;