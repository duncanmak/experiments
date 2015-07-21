import { Observable } from 'rx';

function model(actions: any) {
    let leftClicked = actions.leftClicked$.startWith(false);
    let rightClicked = actions.rightClicked$.startWith(false);

    return Observable.combineLatest(
        leftClicked,
        rightClicked,
        bothClicked,
        (leftClicked, rightClicked) =>
            ({ leftClicked, rightClicked })
    );
}


export default model;