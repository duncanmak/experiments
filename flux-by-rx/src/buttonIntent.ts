import * as Rx from 'rx';

export let leftClicked$  = new Rx.Subject();
export let rightClicked$ = new Rx.Subject();

export let leftButtonClicked  = (value: boolean) => leftClicked$.onNext(value);
export let rightButtonClicked = (value: boolean) => rightClicked$.onNext(value);
