import { Action, action$ } from '../action';
import { registerInitialState } from '../model';
import { assign } from 'lodash';
import { List } from 'immutable';

export let todoAdded = (text: string) => {
    return action$.onNext(new AddTodoAction(text));
}

export let todoRemoved = (idx: number) => {
    return action$.onNext(new RemoveTodoAction(idx));
}

class AddTodoAction implements Action {
    constructor(private text: string) {}

    update(state: TodoState) {
        return assign({}, state, { todos: state.todos.push(this.text) });
    }

    toString() {
        return JSON.stringify({ Add: this.text });
    }
}

class RemoveTodoAction implements Action {
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


registerInitialState({ todos: List() });