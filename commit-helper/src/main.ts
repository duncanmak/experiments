import { render } from 'react-dom';
import { createElement } from 'react';
import { Observable, Subject } from 'rx';
import { Action, Actions } from './actions';
import { InitialState, State, States } from './state';
import { App } from './views';

const content = document.getElementById('content');

async function view (state) {
    let s = await state;
    console.log('view', s);
    render(createElement(App, s), content)
}

function run() {
    console.log('Starting');

    Observable.combineLatest(
        States.startWith(InitialState),
        Actions.startWith(undefined),
        async (state, action) => {
            console.log('State', JSON.stringify(state));
            if (action) {
                console.log('Action', action.name);
                let result = await action(await state);
                Actions.onNext(undefined);
                States.onNext(result);
                return result;
            } else {
                return state;
            }
        }
    )
    .distinctUntilChanged()
    .subscribe(view);
}

window.onload = run;
