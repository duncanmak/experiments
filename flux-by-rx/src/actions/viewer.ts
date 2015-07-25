import { action$, Action } from '../action';
import { registerInitialState } from '../model';
import { assign } from 'lodash';

export let pathChanged = (path: string) => action$.onNext(new PathChangedAction(path));

class PathChangedAction implements Action {
    constructor(private path: string) {}

    update(state: PathState) {
        return assign({}, state, { path: this.path });
    }

    toString() {
        return JSON.stringify({ setPath: this.path })
    }
}
interface PathState {
    path: string;
}

registerInitialState({ path: '' });