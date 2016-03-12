import { createElement } from 'react';
import { render } from 'react-dom';
import { App } from './app';
import { Actions } from './actions';
import { Subject } from 'rx';

const content = document.getElementById('content');
const initial = ["This is a test", "This is another test"];

function view(entries) {
    console.log('rendering', JSON.stringify(entries));
    render(createElement(App, { entries }), content)
}

function run(entries) {
    Actions
        .startWith(entries)
        .scan((s, action) => action.update(s))
        .subscribe(view);
}

window.onload = () => run(initial);