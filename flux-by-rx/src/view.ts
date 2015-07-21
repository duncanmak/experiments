import * as React from 'react';
import { App } from './app';

function view(state$: any) {
  return state$.map((state: any) => {
      return React.createElement(App, state);
  });
}

export default view;
