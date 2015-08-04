import { Action, action$ } from '../action';
import { registerInitialState } from '../model';
import { assign } from 'lodash';
import { List } from 'immutable';

export let todoAdded = (text: string) => {
    return action$.onNext(new AddTodo(text));
}

export let todoRemoved = (idx: number) => {
    return action$.onNext(new RemoveTodo(idx));
}

export class AddTodo implements Action {
    constructor(private text: string) {}

    value() { return this.text; }

    update(state: TodoState) {
        return assign({}, state, { todos: state.todos.push(this.value()) });
    }

    toString() {
        return JSON.stringify({ Add: this.value() });
    }
}

export class RemoveTodo implements Action {
    constructor(private idx: number) {}

    update(state: TodoState) {
        return assign({}, state, { todos: state.todos.remove(this.idx) })
    }

    toString() {
        return JSON.stringify({ Remove: this.idx });
    }
}

interface TodoState {
    todos: List<string>;
}


// registerInitialState({ todos: List() });