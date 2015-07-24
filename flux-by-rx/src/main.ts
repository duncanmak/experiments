import * as React from 'react';

import { actions$, initialState } from './actions';
import model  from './model';
import view   from './view';

function main() {
    let state$ = model(actions$);
    let output$ = view(actions$, state$);
    return output$;
}

main().subscribe((Output: any) => {
    console.log("hello");
    React.render(
        Output,
        document.getElementById('app'));
});

