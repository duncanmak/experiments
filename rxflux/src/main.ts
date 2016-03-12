import { createElement } from 'react';
import { render } from 'react-dom';
import { App } from './app';

const content = document.getElementById('content');
const initial = ["This is a test", "This is another test"];

function view(entries) {
    console.log('rendering', JSON.stringify(entries));
    render(createElement(App, { entries }), content)
}

function run(entries) {
    view(entries);
}

window.onload = () => run(initial);