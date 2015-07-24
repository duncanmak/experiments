import { actions$, registerInitialState } from '../actions';

export let leftButtonClicked  = (value: boolean) => actions$.onNext({ leftClicked:  value });
export let rightButtonClicked = (value: boolean) => actions$.onNext({ rightClicked: value });

registerInitialState({
    leftClicked: false,
    rightClicked: false
});