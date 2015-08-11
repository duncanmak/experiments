import { createElement, render } from 'react';
import { App } from './app';

function run() {
    render(
        createElement(App, {}),
        document.getElementById('app'))
}

window.onload = run;