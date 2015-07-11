import * as React from 'react';
import * as Rx from 'rx';
import App from './app';

const RxDOM = require('rx-dom');

React.render(
    React.createElement(App, {}),
    document.getElementById('app'));

// Rx.Observable.repeat(true, 10, RxDOM.Scheduler.requestAnimationFrame).timeInterval().subscribe(x => console.log(x))
