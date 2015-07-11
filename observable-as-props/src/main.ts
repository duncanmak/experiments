import * as React from 'react';
import * as Rx from 'rx';
import App from './app';

const RxDOM = require('rx-dom');

React.render(
    React.createElement(App, {}),
    document.getElementById('app'));

