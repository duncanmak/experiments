import { action$, Action } from '../action';
import { registerInitialState } from '../model'
import { assign } from 'lodash';

export let leftButtonClicked  = (value: boolean) => action$.onNext(new ButtonClickedAction({ leftClicked:  value }));
export let rightButtonClicked = (value: boolean) => action$.onNext(new ButtonClickedAction({ rightClicked: value }));
export let makeItSoClicked    = (value: boolean) => action$.onNext(new ButtonClickedAction({ leftClicked: value, rightClicked: value }));

class ButtonClickedAction implements Action {
    constructor(private value: ButtonState) {}
    update (state: ButtonState) { return assign({}, state, this.value); }
}

interface ButtonState { leftClicked?: boolean, rightClicked?: boolean }

// registerInitialState({
//     leftClicked: false,
//     rightClicked: false
// });
