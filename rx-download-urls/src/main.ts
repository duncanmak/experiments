import 'babel-polyfill';
import { render } from 'react-dom';
import { createElement } from 'react';
import { App } from './app';
import { Jenkins } from './jenkins';

const content = document.getElementById('content');
render(createElement(App), content);
