import * as Rx from 'rx';

let leftButtonClickedAction = new Rx.Subject();
export let leftButtonClicked = (value: boolean) => leftButtonClickedAction.onNext(value);
export let leftClicked$ = leftButtonClickedAction;

let rightButtonClickedAction = new Rx.Subject();
export let rightButtonClicked = (value: boolean) => rightButtonClickedAction.onNext(value);
export let rightClicked$ = rightButtonClickedAction;
