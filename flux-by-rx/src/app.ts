import * as React from 'react';
import { DOM } from 'react';
import { Viewer } from './viewer';
import { Button, MakeItSo } from './buttons';
import { todoAdded, todoRemoved } from './actions/todo';
import { get } from 'lodash';

export class App extends React.Component<any, any> {

    handleKeyDown(evt: React.KeyboardEvent) {
        if (evt.keyCode == 13) {
            todoAdded((<any>evt.target).value);
            (<any>evt.target).value = "";
        }
    }

    renderTodo(todo: string, key: number) {
        return DOM.div(
            {},
            DOM.li({ key, onClick: evt => todoRemoved(key) }, todo)
            )
    }

    render() {
        let { state, action } = this.props;
        return DOM.div({},
            DOM.h1({}, "To Do List"),
            React.createElement(Viewer, { data: this.props }),
            DOM.ul({}, this.props.state.todos.map(this.renderTodo)),
            DOM.input({ type: 'text', defaultValue: 'Add todo', onKeyDown: this.handleKeyDown })
);
    }
}

