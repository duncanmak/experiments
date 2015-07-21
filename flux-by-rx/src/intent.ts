import { leftClicked$, rightClicked$ } from './buttonIntent';

function intent() {
  let actions = {
    leftClicked$,
    rightClicked$,
  };

  return actions;
}

export default intent;