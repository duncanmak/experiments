import * as React from 'react';

import { actions$, initialState } from './actions';
import model  from './model';
import view   from './view';

function main() {
    let state$ = model(actions$);
    let output$ = view(state$, actions$);
    return output$;
}

main().subscribe((Output: any) => {
    React.render(
        Output,
        document.getElementById('app'));
});

