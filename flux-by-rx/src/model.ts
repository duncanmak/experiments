import { Observable } from 'rx';

function model(actions: any) {
    let leftClicked = actions.leftClicked$.startWith(false);
    let rightClicked = actions.rightClicked$.startWith(false);

    return Observable.combineLatest(
        leftClicked,
        rightClicked,
        (leftClicked, rightClicked) => {
            let isDisabled = leftClicked == rightClicked;
            return { leftClicked, rightClicked, isDisabled };
        }
    );
}


export default model;