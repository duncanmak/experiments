import { render } from 'react-dom';
import { createElement } from 'react';
import { MainView } from './views';

console.log('Starting');
render(createElement(MainView), document.getElementById('content'));