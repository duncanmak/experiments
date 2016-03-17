import { render } from 'react-dom';
import { createElement } from 'react';
import { Observable, Subject } from 'rx';
import { Action, Actions } from './actions';
import { InitialState, State, States } from './state';
import { App } from './views';

const content = document.getElementById('content');

console.log('Starting');

function run() {
    Observable.combineLatest(
        States.startWith(InitialState),
        Actions.startWith(undefined),
        async (state, action) => action && action(await state)
    ).subscribe(async (state) => render(createElement(App, await state), content));
}

window.onload = run;