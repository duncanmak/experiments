import 'babel-polyfill';
import { render } from 'react-dom';
import { createElement } from 'react';
import { Observable, Subject } from 'rx';
import { Action, Actions } from './actions';
import { InitialState, State } from './state';
import { App } from './views';

const content = document.getElementById('content');

async function view (s) {
    let state = await s;
    render(createElement(App, state), content);
}

function run() {
    Actions
        .startWith(InitialState)
        .scan((s: Promise<State>, action: Action) => Promise.resolve(s).then(action))
        .subscribe(view);
}

window.onload = run;