import * as React from 'react';
import { action$, Action } from './action';
import { ClearActions } from './actions/clearActions';
import * as Rx from 'rx';
import { Observable } from 'rx';
import { model, initialState } from './model';
import view from './view';

const lrApi = require('livereactload-api')

function replayAction$() {
    let savedActions: Action[] = lrApi.getState('action');
    if (savedActions) {
        console.log('playback', savedActions.length, 'actions');
        return Observable.fromArray(savedActions).concat(action$);
    } else {
        return action$;
    }
}

function run() {
    console.log("Running");

    let replay$ = replayAction$();
    let state$ = model(replay$, initialState);

    let playback$ = replay$.scan([], (actions, a) => {
        if (a instanceof ClearActions) {
            return [];
        }
        console.log('Playback', a.toString());
        return <Action[]>[...actions, a]
    });

    let output$ = view(state$, playback$);
    output$.subscribe((comp) => {
        React.render(
            comp,
            document.getElementById('app'))
    });

    playback$.subscribe((a: any) => {
        lrApi.setState('action', a);
    });
}

// live reloading
lrApi.onReload(() => run())
window.onload = run;